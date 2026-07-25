import { Router, type IRouter, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { journalPostsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router: IRouter = Router();

// ── List published posts ───────────────────────────────────────────────────────
router.get("/journal", async (_req: Request, res: Response) => {
  try {
    const posts = await db
      .select()
      .from(journalPostsTable)
      .where(eq(journalPostsTable.published, true))
      .orderBy(desc(journalPostsTable.publishedAt));
    res.json({ posts });
  } catch {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

// ── Get single published post ─────────────────────────────────────────────────
router.get("/journal/:slug", async (req: Request, res: Response) => {
  try {
    const [post] = await db
      .select()
      .from(journalPostsTable)
      .where(eq(journalPostsTable.slug, req.params.slug));
    if (!post || !post.published) return res.status(404).json({ error: "Not found" });
    res.json({ post });
  } catch {
    res.status(500).json({ error: "Failed to fetch post" });
  }
});

export default router;
