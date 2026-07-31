import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import { db } from "@workspace/db";
import { storiesTable, storyPhotosTable, journalPostsTable, slideshowPhotosTable } from "@workspace/db";
import { eq, asc, desc } from "drizzle-orm";
import { ObjectStorageService } from "../lib/objectStorage";

const router: IRouter = Router();
const objectStorageService = new ObjectStorageService();

// ── Auth middleware ────────────────────────────────────────────────────────────
function adminAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers["x-admin-token"] as string | undefined;
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    // No password set — allow access in dev (warn in logs)
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

// ── List stories ──────────────────────────────────────────────────────────────
router.get("/admin/stories", async (_req: Request, res: Response) => {
  try {
    const rows = await db.select().from(storiesTable).orderBy(asc(storiesTable.slug));
    res.json({ stories: rows });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch stories" });
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
  const { title, couple, location, narrative, pause, reflection, videoUrl, hasFilm, heroImage } = req.body;
  try {
    await db.update(storiesTable)
      .set({ title, couple, location, narrative, pause, reflection, videoUrl, hasFilm, heroImage,
             updatedAt: new Date() })
      .where(eq(storiesTable.slug, req.params.slug));
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "Failed to update story" });
  }
});

// ── Delete story ──────────────────────────────────────────────────────────────
router.delete("/admin/stories/:slug", async (req: Request, res: Response) => {
  try {
    await db.delete(storyPhotosTable).where(eq(storyPhotosTable.storySlug, req.params.slug));
    await db.delete(storiesTable).where(eq(storiesTable.slug, req.params.slug));
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "Failed to delete story" });
  }
});

// ── Request upload URL ────────────────────────────────────────────────────────
router.post("/admin/photos/request-url", async (req: Request, res: Response) => {
  try {
    const uploadURL = await objectStorageService.getObjectEntityUploadURL();
    const objectPath = objectStorageService.normalizeObjectEntityPath(uploadURL);
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
    const [photo] = await db.insert(slideshowPhotosTable).values({ url, objectPath, position: position ?? 0 }).returning();
    res.json({ photo });
  } catch { res.status(500).json({ error: "Failed to save slideshow photo" }); }
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

export default router;
