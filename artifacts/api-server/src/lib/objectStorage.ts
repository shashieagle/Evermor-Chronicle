import { randomUUID } from 'crypto';
import { Readable } from 'stream';
import { File, Storage } from '@google-cloud/storage';
import {
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import {
  canAccessObject,
  getObjectAclPolicy,
  ObjectAclPolicy,
  ObjectPermission,
  setObjectAclPolicy,
} from './objectAcl';

const REPLIT_SIDECAR_ENDPOINT = 'http://127.0.0.1:1106';

export function isR2Storage(): boolean {
  const backend = process.env.STORAGE_BACKEND || 'gcs';
  if (backend !== 'gcs' && backend !== 'r2') {
    throw new Error(`Unsupported STORAGE_BACKEND: ${backend}`);
  }
  return backend === 'r2';
}

function getR2Config() {
  const names = [
    'R2_ACCOUNT_ID',
    'R2_BUCKET_NAME',
    'R2_ACCESS_KEY_ID',
    'R2_SECRET_ACCESS_KEY',
  ] as const;
  const missing = names.filter((name) => !process.env[name]);
  if (missing.length > 0) {
    throw new Error(`R2 storage is selected but required configuration is missing: ${missing.join(', ')}`);
  }
  return {
    accountId: process.env.R2_ACCOUNT_ID!,
    bucketName: process.env.R2_BUCKET_NAME!,
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  };
}

export function validateStorageConfig(): void {
  if (isR2Storage()) getR2Config();
}

let r2Client: S3Client | undefined;
function getR2Client(): S3Client {
  const config = getR2Config();
  if (!r2Client) {
    r2Client = new S3Client({
      region: 'auto',
      endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
      forcePathStyle: true,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    });
  }
  return r2Client;
}

export const objectStorageClient = new Storage({
  credentials: {
    audience: 'replit',
    subject_token_type: 'access_token',
    token_url: `${REPLIT_SIDECAR_ENDPOINT}/token`,
    type: 'external_account',
    credential_source: {
      url: `${REPLIT_SIDECAR_ENDPOINT}/credential`,
      format: {
        type: 'json',
        subject_token_field_name: 'access_token',
      },
    },
    universe_domain: 'googleapis.com',
  },
  projectId: '',
});

export type StoredObject =
  | { backend: 'gcs'; file: File }
  | { backend: 'r2'; key: string };

function isMissingR2Object(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const candidate = error as { name?: string; $metadata?: { httpStatusCode?: number } };
  return candidate.name === 'NoSuchKey' || candidate.name === 'NotFound' ||
    candidate.$metadata?.httpStatusCode === 404;
}

export class ObjectNotFoundError extends Error {
  constructor() {
    super('Object not found');
    this.name = 'ObjectNotFoundError';
    Object.setPrototypeOf(this, ObjectNotFoundError.prototype);
  }
}

export class ObjectStorageService {
  constructor() {}

  getPublicObjectSearchPaths(): Array<string> {
    const pathsStr = process.env.PUBLIC_OBJECT_SEARCH_PATHS || '';
    const paths = Array.from(
      new Set(
        pathsStr
          .split(',')
          .map((path) => path.trim())
          .filter((path) => path.length > 0),
      ),
    );
    if (paths.length === 0) {
      throw new Error(
        "PUBLIC_OBJECT_SEARCH_PATHS not set. Create a bucket in 'Object Storage' " +
          'tool and set PUBLIC_OBJECT_SEARCH_PATHS env var (comma-separated paths).',
      );
    }
    return paths;
  }

  getPrivateObjectDir(): string {
    const dir = process.env.PRIVATE_OBJECT_DIR || '';
    if (!dir) {
      throw new Error(
        "PRIVATE_OBJECT_DIR not set. Create a bucket in 'Object Storage' " +
          'tool and set PRIVATE_OBJECT_DIR env var.',
      );
    }
    return dir;
  }

  async searchPublicObject(filePath: string): Promise<File | StoredObject | null> {
    if (isR2Storage()) {
      const key = filePath.replace(/^\/+/, '');
      if (!key.startsWith('uploads/')) return null;
      const { bucketName } = getR2Config();
      try {
        await getR2Client().send(new HeadObjectCommand({ Bucket: bucketName, Key: key }));
        return { backend: 'r2', key };
      } catch (error) {
        if (isMissingR2Object(error)) return null;
        throw error;
      }
    }
    for (const searchPath of this.getPublicObjectSearchPaths()) {
      const fullPath = `${searchPath}/${filePath}`;

      const { bucketName, objectName } = parseObjectPath(fullPath);
      const bucket = objectStorageClient.bucket(bucketName);
      const file = bucket.file(objectName);

      const [exists] = await file.exists();
      if (exists) {
        return file;
      }
    }

    return null;
  }

  async downloadObject(
    file: File | StoredObject,
    cacheTtlSec: number = 3600,
  ): Promise<Response> {
    if (isR2Storage()) {
      const storedObject = file as StoredObject;
      if (storedObject.backend !== 'r2') throw new Error('Invalid R2 object reference');
      const { bucketName } = getR2Config();
      let result;
      try {
        result = await getR2Client().send(
          new GetObjectCommand({ Bucket: bucketName, Key: storedObject.key }),
        );
      } catch (error) {
        if (isMissingR2Object(error)) throw new ObjectNotFoundError();
        throw error;
      }
      if (!result.Body) throw new ObjectNotFoundError();
      const nodeStream = result.Body as Readable;
      const headers: Record<string, string> = {
        'Content-Type': result.ContentType || 'application/octet-stream',
        'Cache-Control': `private, max-age=${cacheTtlSec}`,
      };
      if (result.ContentLength !== undefined) {
        headers['Content-Length'] = String(result.ContentLength);
      }
      return new Response(Readable.toWeb(nodeStream) as ReadableStream, { headers });
    }
    const gcsFile = (file as StoredObject).backend === 'gcs'
      ? (file as Extract<StoredObject, { backend: 'gcs' }>).file
      : file as File;
    const [metadata] = await gcsFile.getMetadata();
    const aclPolicy = await getObjectAclPolicy(gcsFile);
    const isPublic = aclPolicy?.visibility === 'public';

    const nodeStream = gcsFile.createReadStream();
    const webStream = Readable.toWeb(nodeStream) as ReadableStream;

    const headers: Record<string, string> = {
      'Content-Type':
        (metadata.contentType as string) || 'application/octet-stream',
      'Cache-Control': `${isPublic ? 'public' : 'private'}, max-age=${cacheTtlSec}`,
    };
    if (metadata.size) {
      headers['Content-Length'] = String(metadata.size);
    }

    return new Response(webStream, { headers });
  }

  async getObjectEntityUploadURL(): Promise<string> {
    return (await this.getObjectEntityUploadInfo()).uploadURL;
  }

  async getObjectEntityUploadInfo(): Promise<{ uploadURL: string; objectPath: string }> {
    if (isR2Storage()) {
      const { bucketName } = getR2Config();
      const key = `uploads/${randomUUID()}`;
      const uploadURL = await getSignedUrl(
        getR2Client(),
        new PutObjectCommand({ Bucket: bucketName, Key: key }),
        { expiresIn: 900 },
      );
      return { uploadURL, objectPath: `/objects/${key}` };
    }
    const privateObjectDir = this.getPrivateObjectDir();
    if (!privateObjectDir) {
      throw new Error(
        "PRIVATE_OBJECT_DIR not set. Create a bucket in 'Object Storage' " +
          'tool and set PRIVATE_OBJECT_DIR env var.',
      );
    }

    const objectId = randomUUID();
    const fullPath = `${privateObjectDir}/uploads/${objectId}`;

    const { bucketName, objectName } = parseObjectPath(fullPath);

    const uploadURL = await signObjectURL({
      bucketName,
      objectName,
      method: 'PUT',
      ttlSec: 900,
    });
    return {
      uploadURL,
      objectPath: this.normalizeObjectEntityPath(uploadURL),
    };
  }

  async getObjectEntityFile(objectPath: string): Promise<File | StoredObject> {
    if (!objectPath.startsWith('/objects/')) {
      throw new ObjectNotFoundError();
    }

    const parts = objectPath.slice(1).split('/');
    if (parts.length < 2) {
      throw new ObjectNotFoundError();
    }

    const entityId = parts.slice(1).join('/');
    if (isR2Storage()) {
      if (!entityId.startsWith('uploads/')) throw new ObjectNotFoundError();
      const { bucketName } = getR2Config();
      try {
        await getR2Client().send(new HeadObjectCommand({ Bucket: bucketName, Key: entityId }));
      } catch (error) {
        if (isMissingR2Object(error)) throw new ObjectNotFoundError();
        throw error;
      }
      return { backend: 'r2', key: entityId };
    }
    let entityDir = this.getPrivateObjectDir();
    if (!entityDir.endsWith('/')) {
      entityDir = `${entityDir}/`;
    }
    const objectEntityPath = `${entityDir}${entityId}`;
    const { bucketName, objectName } = parseObjectPath(objectEntityPath);
    const bucket = objectStorageClient.bucket(bucketName);
    const objectFile = bucket.file(objectName);
    const [exists] = await objectFile.exists();
    if (!exists) {
      throw new ObjectNotFoundError();
    }
    return objectFile;
  }

  normalizeObjectEntityPath(rawPath: string): string {
    if (isR2Storage()) {
      try {
        const url = new URL(rawPath);
        const { bucketName } = getR2Config();
        const path = decodeURIComponent(url.pathname).replace(/^\/+/, '');
        const key = path.startsWith(`${bucketName}/`) ? path.slice(bucketName.length + 1) : path;
        return key.startsWith('uploads/') ? `/objects/${key}` : rawPath;
      } catch {
        return rawPath;
      }
    }
    if (!rawPath.startsWith('https://storage.googleapis.com/')) {
      return rawPath;
    }

    const url = new URL(rawPath);
    const rawObjectPath = url.pathname;

    let objectEntityDir = this.getPrivateObjectDir();
    if (!objectEntityDir.endsWith('/')) {
      objectEntityDir = `${objectEntityDir}/`;
    }

    if (!rawObjectPath.startsWith(objectEntityDir)) {
      return rawObjectPath;
    }

    const entityId = rawObjectPath.slice(objectEntityDir.length);
    return `/objects/${entityId}`;
  }

  async trySetObjectEntityAclPolicy(
    rawPath: string,
    aclPolicy: ObjectAclPolicy,
  ): Promise<string> {
    const normalizedPath = this.normalizeObjectEntityPath(rawPath);
    if (!normalizedPath.startsWith('/')) {
      return normalizedPath;
    }

    if (isR2Storage()) return normalizedPath;
    const objectFile = await this.getObjectEntityFile(normalizedPath);
    await setObjectAclPolicy(objectFile as File, aclPolicy);
    return normalizedPath;
  }

  async canAccessObjectEntity({
    userId,
    objectFile,
    requestedPermission,
  }: {
    userId?: string;
    objectFile: File;
    requestedPermission?: ObjectPermission;
  }): Promise<boolean> {
    if (isR2Storage()) return false;
    return canAccessObject({
      userId,
      objectFile,
      requestedPermission: requestedPermission ?? ObjectPermission.READ,
    });
  }

  async readObjectEntity(objectPath: string): Promise<Buffer> {
    const object = await this.getObjectEntityFile(objectPath);
    if (!isR2Storage()) {
      const [data] = await (object as File).download();
      return data;
    }
    const { bucketName } = getR2Config();
    const result = await getR2Client().send(
      new GetObjectCommand({ Bucket: bucketName, Key: (object as Extract<StoredObject, { backend: 'r2' }>).key }),
    );
    if (!result.Body) throw new ObjectNotFoundError();
    return Buffer.from(await result.Body.transformToByteArray());
  }

  async writeObjectEntity(
    objectPath: string,
    data: Buffer,
    contentType: string,
    cacheControl?: string,
  ): Promise<void> {
    if (isR2Storage()) {
      const key = this.getR2EntityKey(objectPath);
      const { bucketName } = getR2Config();
      await getR2Client().send(new PutObjectCommand({
        Bucket: bucketName, Key: key, Body: data, ContentType: contentType,
        ...(cacheControl ? { CacheControl: cacheControl } : {}),
      }));
      return;
    }
    const entityKey = this.getR2EntityKey(objectPath);
    const privateDir = this.getPrivateObjectDir();
    const fullPath = `${privateDir.replace(/\/+$/, '')}/${entityKey}`;
    const { bucketName, objectName } = parseObjectPath(fullPath);
    const file = objectStorageClient.bucket(bucketName).file(objectName);
    await file.save(data, {
      contentType,
      resumable: false,
      ...(cacheControl ? { metadata: { cacheControl } } : {}),
    });
  }

  private getR2EntityKey(objectPath: string): string {
    if (!objectPath.startsWith('/objects/uploads/')) throw new ObjectNotFoundError();
    return objectPath.slice('/objects/'.length);
  }
}

function parseObjectPath(path: string): {
  bucketName: string;
  objectName: string;
} {
  if (!path.startsWith('/')) {
    path = `/${path}`;
  }
  const pathParts = path.split('/');
  if (pathParts.length < 3) {
    throw new Error('Invalid path: must contain at least a bucket name');
  }

  const bucketName = pathParts[1];
  const objectName = pathParts.slice(2).join('/');

  return {
    bucketName,
    objectName,
  };
}

/**
 * Write a JSON value to a path within the private object storage dir.
 * Path should be relative, e.g. "sync/snapshot.json".
 */
export async function writeJsonToStorage(relativePath: string, data: unknown): Promise<void> {
  if (isR2Storage()) {
    const { bucketName } = getR2Config();
    await getR2Client().send(new PutObjectCommand({
      Bucket: bucketName,
      Key: relativePath.replace(/^\/+/, ''),
      Body: JSON.stringify(data),
      ContentType: 'application/json',
    }));
    return;
  }
  const privateDir = process.env.PRIVATE_OBJECT_DIR || '';
  if (!privateDir) throw new Error('PRIVATE_OBJECT_DIR not set');
  const dir = privateDir.endsWith('/') ? privateDir : `${privateDir}/`;
  const fullPath = `${dir}${relativePath}`;
  const { bucketName, objectName } = parseObjectPath(fullPath);
  const bucket = objectStorageClient.bucket(bucketName);
  const file = bucket.file(objectName);
  await file.save(JSON.stringify(data), { contentType: 'application/json', resumable: false });
}

/**
 * Read a JSON value from a path within the private object storage dir.
 * Returns null if the file does not exist.
 */
export async function readJsonFromStorage(relativePath: string): Promise<unknown | null> {
  if (isR2Storage()) {
    const { bucketName } = getR2Config();
    try {
      const result = await getR2Client().send(new GetObjectCommand({
        Bucket: bucketName, Key: relativePath.replace(/^\/+/, ''),
      }));
      if (!result.Body) return null;
      return JSON.parse(await result.Body.transformToString('utf-8'));
    } catch (error) {
      if (isMissingR2Object(error)) return null;
      throw error;
    }
  }
  const privateDir = process.env.PRIVATE_OBJECT_DIR || '';
  if (!privateDir) return null;
  const dir = privateDir.endsWith('/') ? privateDir : `${privateDir}/`;
  const fullPath = `${dir}${relativePath}`;
  const { bucketName, objectName } = parseObjectPath(fullPath);
  const bucket = objectStorageClient.bucket(bucketName);
  const file = bucket.file(objectName);
  const [exists] = await file.exists();
  if (!exists) return null;
  const [contents] = await file.download();
  return JSON.parse(contents.toString('utf-8'));
}

async function signObjectURL({
  bucketName,
  objectName,
  method,
  ttlSec,
}: {
  bucketName: string;
  objectName: string;
  method: 'GET' | 'PUT' | 'DELETE' | 'HEAD';
  ttlSec: number;
}): Promise<string> {
  const request = {
    bucket_name: bucketName,
    object_name: objectName,
    method,
    expires_at: new Date(Date.now() + ttlSec * 1000).toISOString(),
  };
  const response = await fetch(
    `${REPLIT_SIDECAR_ENDPOINT}/object-storage/signed-object-url`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
      signal: AbortSignal.timeout(30_000),
    },
  );
  if (!response.ok) {
    throw new Error(
      `Failed to sign object URL, errorcode: ${response.status}, ` +
        `make sure you're running on Replit`,
    );
  }

  const { signed_url: signedURL } = (await response.json()) as {
    signed_url: string;
  };
  return signedURL;
}
