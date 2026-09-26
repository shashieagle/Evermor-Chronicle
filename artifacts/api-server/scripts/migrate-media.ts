/**
 * Copy existing database-referenced media into R2 without changing database paths.
 *
 * From the repository root, provide NEON_DATABASE_URL, R2_ACCESS_KEY_ID,
 * R2_SECRET_ACCESS_KEY, R2_ACCOUNT_ID, R2_BUCKET_NAME, and SOURCE_ORIGIN
 * (the published site's HTTPS origin). The script defaults to dry-run:
 *
 *   pnpm --filter @workspace/api-server exec tsx scripts/migrate-media.ts
 *   pnpm --filter @workspace/api-server exec tsx scripts/migrate-media.ts --apply
 */
import { createHash } from "node:crypto";
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { sql } from "drizzle-orm";

type StorageConfig = {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
  sourceOrigin: string;
};

type ObjectReference = {
  key: string;
  sourceMime: string;
  bytes: Buffer;
};

const LOCAL_OBJECT_PREFIXES = ["/api/storage/objects/", "/objects/"] as const;

function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

function readConfig(): StorageConfig {
  const sourceOriginRaw = requiredEnv("SOURCE_ORIGIN");
  let sourceUrl: URL;
  try {
    sourceUrl = new URL(sourceOriginRaw);
  } catch {
    throw new Error("SOURCE_ORIGIN must be an HTTPS origin, such as https://example.com");
  }
  if (
    sourceUrl.protocol !== "https:"
    || sourceUrl.username
    || sourceUrl.password
    || sourceUrl.pathname !== "/"
    || sourceUrl.search
    || sourceUrl.hash
  ) {
    throw new Error("SOURCE_ORIGIN must be an HTTPS origin with no path, credentials, query, or fragment");
  }

  return {
    accountId: requiredEnv("R2_ACCOUNT_ID"),
    accessKeyId: requiredEnv("R2_ACCESS_KEY_ID"),
    secretAccessKey: requiredEnv("R2_SECRET_ACCESS_KEY"),
    bucket: requiredEnv("R2_BUCKET_NAME"),
    sourceOrigin: sourceUrl.origin,
  };
}

function isSafeUploadKey(key: string): boolean {
  if (!key.startsWith("uploads/")) return false;
  const parts = key.split("/");
  return parts.length > 1
    && parts.every(part => part.length > 0 && part !== "." && part !== ".." && /^[A-Za-z0-9._-]+$/.test(part));
}

function normalizeLocalObjectPath(value: unknown): { key?: string; malformed?: string } | undefined {
  if (typeof value !== "string") return undefined;
  const prefix = LOCAL_OBJECT_PREFIXES.find(candidate => value.startsWith(candidate));
  if (!prefix) return undefined;

  const key = value.slice(prefix.length);
  if (!isSafeUploadKey(key)) return { malformed: "recognized local object path is not a safe uploads key" };
  return { key };
}

function sha256(bytes: Uint8Array): string {
  return createHash("sha256").update(bytes).digest("hex");
}

function safeErrorCode(error: unknown): string {
  if (error && typeof error === "object") {
    const value = error as { name?: unknown; Code?: unknown; code?: unknown; cause?: { code?: unknown } };
    for (const code of [value.code, value.Code, value.cause?.code, value.name]) {
      if (typeof code === "string" && /^[A-Za-z0-9_-]{1,80}$/.test(code)) return code;
    }
  }
  return "operation-failed";
}

function isNotFound(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const value = error as { name?: unknown; Code?: unknown; $metadata?: { httpStatusCode?: number } };
  return value.$metadata?.httpStatusCode === 404
    || value.name === "NoSuchKey"
    || value.name === "NotFound"
    || value.Code === "NoSuchKey"
    || value.Code === "NotFound";
}

async function readObjectBody(body: unknown): Promise<Buffer> {
  if (!body || typeof body !== "object" || !("transformToByteArray" in body)) {
    throw new Error("R2 response did not include a readable object body");
  }
  const transform = (body as { transformToByteArray: () => Promise<Uint8Array> }).transformToByteArray;
  return Buffer.from(await transform.call(body));
}

async function readSourceObject(sourceOrigin: string, key: string): Promise<ObjectReference> {
  const encodedKey = key.split("/").map(encodeURIComponent).join("/");
  const response = await fetch(`${sourceOrigin}/api/storage/objects/${encodedKey}`, {
    redirect: "follow",
  });
  if (response.status !== 200) {
    throw new Error(`source-http-${response.status}`);
  }
  if (new URL(response.url).origin !== sourceOrigin) {
    throw new Error("source-redirected-outside-origin");
  }

  const contentType = response.headers.get("content-type")?.split(";", 1)[0].trim();
  if (!contentType || !contentType.toLowerCase().startsWith("image/")) {
    throw new Error("source-did-not-return-an-image-content-type");
  }
  return {
    key,
    sourceMime: contentType,
    bytes: Buffer.from(await response.arrayBuffer()),
  };
}

async function getExistingObject(client: S3Client, bucket: string, key: string): Promise<Buffer | undefined> {
  try {
    const result = await client.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
    return await readObjectBody(result.Body);
  } catch (error) {
    if (isNotFound(error)) return undefined;
    throw error;
  }
}

async function readDatabaseObjectPaths(): Promise<unknown[]> {
  // DATABASE_URL is set to NEON_DATABASE_URL before this dynamic import because
  // @workspace/db validates the environment and creates its pool during import.
  const database = await import("@workspace/db");
  try {
    return await database.db.transaction(async tx => {
      await tx.execute(sql`SET TRANSACTION READ ONLY`);
      const stories = await tx.select({ heroImage: database.storiesTable.heroImage }).from(database.storiesTable);
      const storyPhotos = await tx.select({
        objectPath: database.storyPhotosTable.objectPath,
        url: database.storyPhotosTable.url,
      }).from(database.storyPhotosTable);
      const slideshowPhotos = await tx.select({
        objectPath: database.slideshowPhotosTable.objectPath,
        url: database.slideshowPhotosTable.url,
        displayObjectPath: database.slideshowPhotosTable.displayObjectPath,
        displayUrl: database.slideshowPhotosTable.displayUrl,
        thumbnailObjectPath: database.slideshowPhotosTable.thumbnailObjectPath,
        thumbnailUrl: database.slideshowPhotosTable.thumbnailUrl,
      }).from(database.slideshowPhotosTable);
      const journalPosts = await tx.select({ coverImage: database.journalPostsTable.coverImage }).from(database.journalPostsTable);

      return [
        ...stories.map(row => row.heroImage),
        ...storyPhotos.flatMap(row => [row.objectPath, row.url]),
        ...slideshowPhotos.flatMap(row => [
          row.objectPath,
          row.url,
          row.displayObjectPath,
          row.displayUrl,
          row.thumbnailObjectPath,
          row.thumbnailUrl,
        ]),
        ...journalPosts.map(row => row.coverImage),
      ];
    });
  } finally {
    await database.pool.end();
  }
}

async function runMigration() {
  const apply = process.argv.slice(2);
  if (apply.some(argument => argument !== "--apply") || apply.length > 1) {
    throw new Error("Usage: tsx artifacts/api-server/scripts/migrate-media.ts [--apply]");
  }
  const isApply = apply.includes("--apply");

  // Assign before importing @workspace/db: its module creates a connection pool
  // immediately and must use the explicitly supplied Neon URL.
  process.env.DATABASE_URL = requiredEnv("NEON_DATABASE_URL");
  const config = readConfig();
  const candidates = await readDatabaseObjectPaths();

  const uniqueKeys = new Set<string>();
  let recognizedReferences = 0;
  let failures = 0;
  for (const candidate of candidates) {
    const normalized = normalizeLocalObjectPath(candidate);
    if (!normalized) continue;
    recognizedReferences += 1;
    if (normalized.malformed) {
      failures += 1;
      console.error(`FAIL invalid referenced path: ${normalized.malformed}`);
    } else if (normalized.key) {
      uniqueKeys.add(normalized.key);
    }
  }

  const client = new S3Client({
    region: "auto",
    endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
    forcePathStyle: true,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  });

  let downloaded = 0;
  let identical = 0;
  let wouldUpload = 0;
  let uploaded = 0;
  try {
    // Deliberately sequential: keep source and object-storage load bounded.
    for (const key of uniqueKeys) {
      let reference: ObjectReference;
      try {
        reference = await readSourceObject(config.sourceOrigin, key);
        downloaded += 1;
      } catch (error) {
        failures += 1;
        console.error(`FAIL source ${key}: ${safeErrorCode(error)}`);
        continue;
      }

      let existing: Buffer | undefined;
      try {
        existing = await getExistingObject(client, config.bucket, key);
      } catch (error) {
        failures += 1;
        console.error(`FAIL R2 read ${key}: ${safeErrorCode(error)}`);
        continue;
      }

      const sourceHash = sha256(reference.bytes);
      if (existing) {
        if (sha256(existing) !== sourceHash) {
          failures += 1;
          console.error(`FAIL existing R2 object differs; refusing to overwrite ${key}`);
        } else {
          identical += 1;
          console.info(`SKIP identical ${key}`);
        }
        continue;
      }

      if (!isApply) {
        wouldUpload += 1;
        console.info(`DRY-RUN would upload ${key}`);
        continue;
      }

      try {
        await client.send(new PutObjectCommand({
          Bucket: config.bucket,
          Key: key,
          Body: reference.bytes,
          ContentType: reference.sourceMime,
          IfNoneMatch: "*",
        }));
        const readBack = await getExistingObject(client, config.bucket, key);
        if (!readBack || sha256(readBack) !== sourceHash) {
          throw new Error("read-back-hash-mismatch");
        }
        uploaded += 1;
        console.info(`UPLOADED and verified ${key}`);
      } catch (error) {
        failures += 1;
        console.error(`FAIL R2 upload or verification ${key}: ${safeErrorCode(error)}`);
      }
    }
  } finally {
    client.destroy();
  }

  console.info(
    `${isApply ? "APPLY" : "DRY-RUN"} summary: `
    + `referenced paths=${recognizedReferences}, unique keys=${uniqueKeys.size}, `
    + `downloaded=${downloaded}, identical=${identical}, would upload=${wouldUpload}, `
    + `uploaded=${uploaded}, failures=${failures}`,
  );
  if (failures > 0) process.exitCode = 1;
}

runMigration().catch(error => {
  // Avoid printing exception messages: database/SDK errors can contain connection URLs.
  console.error(`Migration failed: ${safeErrorCode(error)}`);
  process.exitCode = 1;
});