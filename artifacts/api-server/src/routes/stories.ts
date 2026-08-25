import { Router, type IRouter, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { storiesTable, storyPhotosTable } from "@workspace/db";
import { eq, asc, isNull, and } from "drizzle-orm";

const router: IRouter = Router();
const PUBLIC_STORY_ORDER = [
  "saksham-chitkala",
  "yamini-chris",
  "sakshi-rajat",
  "kaushik-sandhya",
  "shaun-sowmya",
];

// ── List all stories (active only) ───────────────────────────────────────────
router.get("/stories", async (_req: Request, res: Response) => {
  try {
    const rows = await db.select().from(storiesTable)
      .where(isNull(storiesTable.deletedAt))
      .orderBy(asc(storiesTable.slug));
    const order = new Map(PUBLIC_STORY_ORDER.map((slug, index) => [slug, index]));
    rows.sort((a, b) =>
      (order.get(a.slug) ?? Number.MAX_SAFE_INTEGER) -
      (order.get(b.slug) ?? Number.MAX_SAFE_INTEGER)
    );
    res.set("Cache-Control", "no-store");
    res.json({ stories: rows });
  } catch {
    res.status(500).json({ error: "Failed to fetch stories" });
  }
});

// ── Single story with photos ──────────────────────────────────────────────────
router.get("/stories/:slug", async (req: Request, res: Response) => {
  try {
    const [story] = await db.select().from(storiesTable)
      .where(and(eq(storiesTable.slug, req.params.slug), isNull(storiesTable.deletedAt)));
    if (!story) return res.status(404).json({ error: "Not found" });
    const photos = await db.select().from(storyPhotosTable)
      .where(eq(storyPhotosTable.storySlug, req.params.slug))
      .orderBy(asc(storyPhotosTable.position));
    res.set("Cache-Control", "no-store");
    res.json({ story, photos });
  } catch {
    res.status(500).json({ error: "Failed to fetch story" });
  }
});

export default router;
