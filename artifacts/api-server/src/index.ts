import app from "./app";
import { logger } from "./lib/logger";
import { seedIfEmpty, deduplicatePhotos } from "./seed";
import { isR2Storage, validateStorageConfig } from "./lib/objectStorage";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

validateStorageConfig();

app.listen(port, async (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }
  logger.info({ port }, "Server listening");
  if (!isR2Storage()) {
    await deduplicatePhotos();
    await seedIfEmpty();
  }
});
