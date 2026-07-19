import { Router, type IRouter, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { storiesTable, storyPhotosTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";

const router: IRouter = Router();

// ── List all stories ──────────────────────────────────────────────────────────
router.get("/stories", async (_req: Request, res: Response) => {
  try {
    const rows = await db.select().from(storiesTable).orderBy(asc(storiesTable.slug));
    res.json({ stories: rows });
  } catch {
    res.status(500).json({ error: "Failed to fetch stories" });
  }
});

// ── Single story with photos ──────────────────────────────────────────────────
router.get("/stories/:slug", async (req: Request, res: Response) => {
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

export default router;
