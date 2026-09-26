import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import { db } from "@workspace/db";
import { storiesTable, storyPhotosTable, journalPostsTable, slideshowPhotosTable, enquiriesTable } from "@workspace/db";
import { eq, asc, desc, isNull, isNotNull } from "drizzle-orm";
import { ObjectStorageService, writeJsonToStorage, readJsonFromStorage } from "../lib/objectStorage";
import { applySeedSnapshot } from "../seed";
import { createSlideshowVariants } from "../lib/slideshowVariants";

const router: IRouter = Router();
const objectStorageService = new ObjectStorageService();

// ── Auth middleware ────────────────────────────────────────────────────────────
function adminAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers["x-admin-token"] as string | undefined;
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    if (process.env.NODE_ENV === "production") {
      req.log?.error("ADMIN_PASSWORD not set — admin routes are unavailable");
      res.status(503).json({ error: "Admin access is not configured" });
      return;
    }
    // Allow local development without an admin password.
    req.log?.warn("ADMIN_PASSWORD not set — admin routes are unprotected");
    return next();
  }
  if (token === password) return next();
  res.status(401).json({ error: "Unauthorized" });
}

// ── Public: slideshow photos (no auth required) ───────────────────────────────
router.get("/slideshow", async (_req: Request, res: Response) => {
  try {
    const photos = await db.select().from(slideshowPhotosTable).orderBy(asc(slideshowPhotosTable.position));
    res.json({ photos });
  } catch { res.status(500).json({ error: "Failed to fetch slideshow photos" }); }
});

router.use(adminAuth);

// ── Verify ────────────────────────────────────────────────────────────────────
router.post("/admin/verify", (_req: Request, res: Response) => {
  res.json({ ok: true });
});

// ── Enquiries ──────────────────────────────────────────────────────────────────
router.get("/admin/enquiries", async (_req: Request, res: Response) => {
  try {
    const enquiries = await db.select().from(enquiriesTable).orderBy(desc(enquiriesTable.createdAt));
    res.json({ enquiries });
  } catch {
    res.status(500).json({ error: "Failed to fetch enquiries" });
  }
});

router.patch("/admin/enquiries/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { read, archived } = req.body as { read?: unknown; archived?: unknown };

  if (!Number.isInteger(id) || id <= 0 || (read !== undefined && typeof read !== "boolean") ||
      (archived !== undefined && typeof archived !== "boolean")) {
    res.status(400).json({ error: "A valid id and boolean read or archived value are required" });
    return;
  }
  if (read === undefined && archived === undefined) {
    res.status(400).json({ error: "Provide read or archived" });
    return;
  }

  const updates: { readAt?: Date | null; archivedAt?: Date | null } = {};
  if (typeof read === "boolean") updates.readAt = read ? new Date() : null;
  if (typeof archived === "boolean") updates.archivedAt = archived ? new Date() : null;

  try {
    const [enquiry] = await db.update(enquiriesTable)
      .set(updates)
      .where(eq(enquiriesTable.id, id))
      .returning();
    if (!enquiry) {
      res.status(404).json({ error: "Enquiry not found" });
      return;
    }
    res.json({ enquiry });
  } catch {
    res.status(500).json({ error: "Failed to update enquiry" });
  }
});

// ── List stories (active only) ────────────────────────────────────────────────
router.get("/admin/stories", async (_req: Request, res: Response) => {
  try {
    const rows = await db.select().from(storiesTable)
      .where(isNull(storiesTable.deletedAt))
      .orderBy(asc(storiesTable.slug));
    res.json({ stories: rows });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch stories" });
  }
});

// ── List archived (soft-deleted) stories ──────────────────────────────────────
router.get("/admin/stories-archived", async (_req: Request, res: Response) => {
  try {
    const rows = await db.select().from(storiesTable)
      .where(isNotNull(storiesTable.deletedAt))
      .orderBy(desc(storiesTable.deletedAt));
    res.json({ stories: rows });
  } catch {
    res.status(500).json({ error: "Failed to fetch archived stories" });
  }
});

// ── Get single story with photos ──────────────────────────────────────────────
router.get("/admin/stories/:slug", async (req: Request, res: Response) => {
  try {
    const [story] = await db.select().from(storiesTable).where(eq(storiesTable.slug, req.params.slug));
    if (!story) return res.status(404).json({ error: "Not found" });
    const photos = await db.select().from(storyPhotosTable)
      .where(eq(storyPhotosTable.storySlug, req.params.slug))
      .orderBy(asc(storyPhotosTable.position));
    res.json({ story, photos });
  } catch {
    res.status(500).json({ error: "Failed to fetch story" });
  }
});

// ── Create story ──────────────────────────────────────────────────────────────
router.post("/admin/stories", async (req: Request, res: Response) => {
  const { slug, couple, location } = req.body;
  if (!slug || !couple) return res.status(400).json({ error: "slug and couple are required" });
  try {
    const [story] = await db.insert(storiesTable).values({
      slug: (slug as string).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      title: couple,
      couple,
      location: location || "",
      hasFilm: false,
      updatedAt: new Date(),
    }).returning();
    res.json({ story });
  } catch (err: any) {
    if (err?.code === "23505") return res.status(409).json({ error: "A story with this slug already exists" });
    res.status(500).json({ error: "Failed to create story" });
  }
});

// ── Update story fields ───────────────────────────────────────────────────────
router.put("/admin/stories/:slug", async (req: Request, res: Response) => {
  const { title, couple, location, narrative, pause, reflection, videoUrl, filmRuntime, hasFilm, heroImage } = req.body;
  try {
    await db.update(storiesTable)
      .set({ title, couple, location, narrative, pause, reflection, videoUrl, filmRuntime, hasFilm, heroImage,
             updatedAt: new Date() })
      .where(eq(storiesTable.slug, req.params.slug));
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "Failed to update story" });
  }
});

// ── Archive story (soft-delete) ───────────────────────────────────────────────
router.delete("/admin/stories/:slug", async (req: Request, res: Response) => {
  try {
    await db.update(storiesTable)
      .set({ deletedAt: new Date() })
      .where(eq(storiesTable.slug, req.params.slug));
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "Failed to archive story" });
  }
});

// ── Restore archived story ────────────────────────────────────────────────────
router.post("/admin/stories/:slug/restore", async (req: Request, res: Response) => {
  try {
    await db.update(storiesTable)
      .set({ deletedAt: null })
      .where(eq(storiesTable.slug, req.params.slug));
    const [story] = await db.select().from(storiesTable).where(eq(storiesTable.slug, req.params.slug));
    res.json({ story });
  } catch {
    res.status(500).json({ error: "Failed to restore story" });
  }
});

// ── Request upload URL ────────────────────────────────────────────────────────
router.post("/admin/photos/request-url", async (req: Request, res: Response) => {
  try {
    const { uploadURL, objectPath } = await objectStorageService.getObjectEntityUploadInfo();
    res.json({ uploadURL, objectPath });
  } catch (err) {
    res.status(500).json({ error: "Failed to generate upload URL" });
  }
});

// ── Add photo to story ────────────────────────────────────────────────────────
router.post("/admin/stories/:slug/photos", async (req: Request, res: Response) => {
  const { objectPath, position } = req.body;
  if (!objectPath) return res.status(400).json({ error: "objectPath required" });
  try {
    // url that the front-end uses to display — objectPath already starts with /objects/
    const url = `/api/storage${objectPath}`;
    const [photo] = await db.insert(storyPhotosTable).values({
      storySlug: req.params.slug,
      url,
      objectPath,
      position: position ?? 0,
    }).returning();
    res.json({ photo });
  } catch {
    res.status(500).json({ error: "Failed to save photo" });
  }
});

// ── Reorder photos ────────────────────────────────────────────────────────────
router.put("/admin/stories/:slug/photos/reorder", async (req: Request, res: Response) => {
  const { ids } = req.body as { ids: number[] };
  if (!Array.isArray(ids)) return res.status(400).json({ error: "ids array required" });
  try {
    await Promise.all(
      ids.map((id, index) =>
        db.update(storyPhotosTable).set({ position: index }).where(eq(storyPhotosTable.id, id))
      )
    );
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "Failed to reorder photos" });
  }
});

// ── Delete photo ──────────────────────────────────────────────────────────────
router.delete("/admin/photos/:id", async (req: Request, res: Response) => {
  try {
    await db.delete(storyPhotosTable).where(eq(storyPhotosTable.id, Number(req.params.id)));
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "Failed to delete photo" });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// Slideshow admin routes
// ─────────────────────────────────────────────────────────────────────────────

// List slideshow photos
router.get("/admin/slideshow", async (_req: Request, res: Response) => {
  try {
    const photos = await db.select().from(slideshowPhotosTable).orderBy(asc(slideshowPhotosTable.position));
    res.json({ photos });
  } catch { res.status(500).json({ error: "Failed to fetch slideshow photos" }); }
});

// Add slideshow photo
router.post("/admin/slideshow", async (req: Request, res: Response) => {
  const { objectPath, position } = req.body;
  if (!objectPath) return res.status(400).json({ error: "objectPath required" });
  try {
    const url = `/api/storage${objectPath}`;
    const variants = await createSlideshowVariants(objectPath);
    const [photo] = await db.insert(slideshowPhotosTable).values({
      url,
      objectPath,
      ...variants,
      position: position ?? 0,
    }).returning();
    res.json({ photo });
  } catch (err) {
    req.log?.error({ err, objectPath }, "Failed to optimize slideshow photo");
    res.status(500).json({ error: "Failed to optimize and save slideshow photo" });
  }
});

// Generate missing variants for slideshow photos uploaded before optimization.
router.post("/admin/slideshow/backfill", async (req: Request, res: Response) => {
  try {
    const photos = await db.select().from(slideshowPhotosTable).orderBy(asc(slideshowPhotosTable.position));
    let optimized = 0;
    const failures: number[] = [];
    for (const photo of photos) {
      if (photo.displayUrl && photo.thumbnailUrl) continue;
      if (!photo.objectPath) {
        failures.push(photo.id);
        continue;
      }
      try {
        const variants = await createSlideshowVariants(photo.objectPath);
        await db.update(slideshowPhotosTable).set(variants).where(eq(slideshowPhotosTable.id, photo.id));
        optimized += 1;
      } catch (err) {
        req.log?.error({ err, photoId: photo.id }, "Failed to backfill slideshow variants");
        failures.push(photo.id);
      }
    }
    res.status(failures.length ? 207 : 200).json({ ok: failures.length === 0, optimized, failures });
  } catch (err) {
    req.log?.error({ err }, "Failed to backfill slideshow variants");
    res.status(500).json({ error: "Failed to backfill slideshow variants" });
  }
});

// Reorder slideshow photos
router.put("/admin/slideshow/reorder", async (req: Request, res: Response) => {
  const { ids } = req.body as { ids: number[] };
  if (!Array.isArray(ids)) return res.status(400).json({ error: "ids array required" });
  try {
    await Promise.all(ids.map((id, index) =>
      db.update(slideshowPhotosTable).set({ position: index }).where(eq(slideshowPhotosTable.id, id))
    ));
    res.json({ ok: true });
  } catch { res.status(500).json({ error: "Failed to reorder" }); }
});

// Delete slideshow photo
router.delete("/admin/slideshow/:id", async (req: Request, res: Response) => {
  try {
    await db.delete(slideshowPhotosTable).where(eq(slideshowPhotosTable.id, Number(req.params.id)));
    res.json({ ok: true });
  } catch { res.status(500).json({ error: "Failed to delete slideshow photo" }); }
});

// ─────────────────────────────────────────────────────────────────────────────
// Journal admin routes
// ─────────────────────────────────────────────────────────────────────────────

// List all posts
router.get("/admin/journal", async (_req: Request, res: Response) => {
  try {
    const posts = await db.select().from(journalPostsTable).orderBy(desc(journalPostsTable.updatedAt));
    res.json({ posts });
  } catch { res.status(500).json({ error: "Failed to fetch posts" }); }
});

// Get single post
router.get("/admin/journal/:slug", async (req: Request, res: Response) => {
  try {
    const [post] = await db.select().from(journalPostsTable).where(eq(journalPostsTable.slug, req.params.slug));
    if (!post) return res.status(404).json({ error: "Not found" });
    res.json({ post });
  } catch { res.status(500).json({ error: "Failed to fetch post" }); }
});

// Create post
router.post("/admin/journal", async (req: Request, res: Response) => {
  const { slug, title } = req.body;
  if (!slug || !title) return res.status(400).json({ error: "slug and title are required" });
  try {
    const [post] = await db.insert(journalPostsTable).values({
      slug: (slug as string).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      title,
      published: false,
      updatedAt: new Date(),
    }).returning();
    res.json({ post });
  } catch (err: any) {
    if (err?.code === "23505") return res.status(409).json({ error: "An article with this slug already exists" });
    res.status(500).json({ error: "Failed to create post" });
  }
});

// Update post
router.put("/admin/journal/:slug", async (req: Request, res: Response) => {
  const { title, category, excerpt, body, coverImage, published } = req.body;
  try {
    const publishedAt = published
      ? (await db.select({ publishedAt: journalPostsTable.publishedAt }).from(journalPostsTable).where(eq(journalPostsTable.slug, req.params.slug)))[0]?.publishedAt ?? new Date()
      : null;
    await db.update(journalPostsTable)
      .set({ title, category, excerpt, body, coverImage, published, publishedAt, updatedAt: new Date() })
      .where(eq(journalPostsTable.slug, req.params.slug));
    res.json({ ok: true });
  } catch { res.status(500).json({ error: "Failed to update post" }); }
});

// Delete post
router.delete("/admin/journal/:slug", async (req: Request, res: Response) => {
  try {
    await db.delete(journalPostsTable).where(eq(journalPostsTable.slug, req.params.slug));
    res.json({ ok: true });
  } catch { res.status(500).json({ error: "Failed to delete post" }); }
});

// Upload cover image
router.post("/admin/journal/:slug/cover", async (req: Request, res: Response) => {
  const { objectPath } = req.body;
  if (!objectPath) return res.status(400).json({ error: "objectPath required" });
  try {
    const coverImage = `/api/storage/objects${objectPath}`;
    await db.update(journalPostsTable)
      .set({ coverImage, updatedAt: new Date() })
      .where(eq(journalPostsTable.slug, req.params.slug));
    res.json({ coverImage });
  } catch { res.status(500).json({ error: "Failed to save cover image" }); }
});

// ─────────────────────────────────────────────────────────────────────────────
// Sync to Production
// ─────────────────────────────────────────────────────────────────────────────

// POST /api/admin/sync — export current DB state to object storage as a
// snapshot. On next production deploy the server reads this snapshot and upserts
// all data, so changes made in the admin appear on the live site without any
// code change.
router.post("/admin/sync", async (_req: Request, res: Response) => {
  try {
    const [stories, allStoryPhotos, slideshow] = await Promise.all([
      db.select().from(storiesTable)
        .where(isNull(storiesTable.deletedAt))
        .orderBy(asc(storiesTable.slug)),
      db.select().from(storyPhotosTable).orderBy(asc(storyPhotosTable.storySlug), asc(storyPhotosTable.position)),
      db.select().from(slideshowPhotosTable).orderBy(asc(slideshowPhotosTable.position)),
    ]);
    const activeSlugs = new Set(stories.map(s => s.slug));
    const storyPhotos = allStoryPhotos.filter(p => activeSlugs.has(p.storySlug));

    const snapshot = {
      stories: stories.map(s => ({
        slug: s.slug, title: s.title, couple: s.couple, location: s.location,
        narrative: s.narrative, pause: s.pause, reflection: s.reflection,
        videoUrl: s.videoUrl, hasFilm: s.hasFilm, heroImage: s.heroImage,
      })),
      storyPhotos: storyPhotos.map(p => ({
        storySlug: p.storySlug, url: p.url, objectPath: p.objectPath, position: p.position,
      })),
      slideshow: slideshow.map(p => ({
        url: p.url, objectPath: p.objectPath,
        displayUrl: p.displayUrl, displayObjectPath: p.displayObjectPath,
        thumbnailUrl: p.thumbnailUrl, thumbnailObjectPath: p.thumbnailObjectPath,
        position: p.position,
      })),
      syncedAt: new Date().toISOString(),
    };

    await writeJsonToStorage("sync/snapshot.json", snapshot);

    res.json({
      ok: true,
      stories: stories.length,
      photos: storyPhotos.length,
      slideshow: slideshow.length,
      syncedAt: snapshot.syncedAt,
    });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || "Failed to sync to production" });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// Reload from snapshot (hot-reload production DB without a redeploy)
// ─────────────────────────────────────────────────────────────────────────────

// POST /api/admin/reload-from-snapshot — read the latest snapshot from object
// storage and upsert its contents into the live DB immediately.
router.post("/admin/reload-from-snapshot", async (_req: Request, res: Response) => {
  try {
    const raw = await readJsonFromStorage("sync/snapshot.json");
    if (!raw || typeof raw !== "object") {
      return res.status(404).json({ error: "No snapshot found in object storage" });
    }
    const snapshot = raw as {
      stories: any[];
      storyPhotos: any[];
      slideshow: any[];
      syncedAt?: string;
    };
    await applySeedSnapshot(snapshot);
    res.json({
      ok: true,
      stories: snapshot.stories?.length ?? 0,
      photos: snapshot.storyPhotos?.length ?? 0,
      slideshow: snapshot.slideshow?.length ?? 0,
      syncedAt: snapshot.syncedAt,
    });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || "Failed to reload from snapshot" });
  }
});

export default router;
