import sharp from "sharp";
import { ObjectStorageService } from "./objectStorage";

const storage = new ObjectStorageService();

export interface SlideshowVariants {
  displayUrl: string;
  displayObjectPath: string;
  thumbnailUrl: string;
  thumbnailObjectPath: string;
}

function variantPath(originalPath: string, suffix: "display" | "thumbnail"): string {
  return `${originalPath}-${suffix}.webp`;
}

export async function createSlideshowVariants(objectPath: string): Promise<SlideshowVariants> {
  const original = await storage.getObjectEntityFile(objectPath);
  const [source] = await original.download();
  const displayObjectPath = variantPath(objectPath, "display");
  const thumbnailObjectPath = variantPath(objectPath, "thumbnail");
  const display = original.bucket.file(variantPath(original.name, "display"));
  const thumbnail = original.bucket.file(variantPath(original.name, "thumbnail"));

  const [displayBuffer, thumbnailBuffer] = await Promise.all([
    sharp(source)
      .rotate()
      .resize({ width: 1920, height: 1920, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82, effort: 4 })
      .toBuffer(),
    sharp(source)
      .rotate()
      .resize({ width: 360, height: 248, fit: "cover", position: "attention", withoutEnlargement: true })
      .webp({ quality: 72, effort: 4 })
      .toBuffer(),
  ]);

  await Promise.all([
    display.save(displayBuffer, {
      contentType: "image/webp",
      resumable: false,
      metadata: { cacheControl: "public, max-age=31536000, immutable" },
    }),
    thumbnail.save(thumbnailBuffer, {
      contentType: "image/webp",
      resumable: false,
      metadata: { cacheControl: "public, max-age=31536000, immutable" },
    }),
  ]);

  return {
    displayUrl: `/api/storage${displayObjectPath}`,
    displayObjectPath,
    thumbnailUrl: `/api/storage${thumbnailObjectPath}`,
    thumbnailObjectPath,
  };
}