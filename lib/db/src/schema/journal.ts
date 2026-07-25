import { pgTable, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const journalPostsTable = pgTable("journal_posts", {
  slug:        text("slug").primaryKey(),
  title:       text("title").notNull(),
  category:    text("category").notNull().default("Reflection"),
  excerpt:     text("excerpt"),
  body:        text("body"),
  coverImage:  text("cover_image"),
  published:   boolean("published").notNull().default(false),
  publishedAt: timestamp("published_at"),
  updatedAt:   timestamp("updated_at").defaultNow(),
});

export const insertJournalPostSchema = createInsertSchema(journalPostsTable);
export type JournalPost       = typeof journalPostsTable.$inferSelect;
export type InsertJournalPost = z.infer<typeof insertJournalPostSchema>;
