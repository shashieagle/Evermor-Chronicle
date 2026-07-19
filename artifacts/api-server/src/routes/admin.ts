import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import { db } from "@workspace/db";
import { storiesTable, storyPhotosTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
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
    // url that the front-end uses to display = /api/storage/objects/<path>
    const url = `/api/storage/objects${objectPath}`;
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

export default router;
