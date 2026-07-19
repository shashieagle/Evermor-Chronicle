import { pgTable, text, boolean, integer, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const storiesTable = pgTable("stories", {
  slug:        text("slug").primaryKey(),
  title:       text("title").notNull(),
  couple:      text("couple").notNull(),
  location:    text("location").notNull(),
  heroImage:   text("hero_image").notNull(),
  hasFilm:     boolean("has_film").notNull().default(false),
  videoUrl:    text("video_url"),
  narrative:   text("narrative"),
  pause:       text("pause"),
  reflection:  text("reflection"),
  updatedAt:   timestamp("updated_at").defaultNow(),
});

export const storyPhotosTable = pgTable("story_photos", {
  id:          serial("id").primaryKey(),
  storySlug:   text("story_slug").notNull().references(() => storiesTable.slug, { onDelete: "cascade" }),
  url:         text("url").notNull(),
  objectPath:  text("object_path"),        // normalized GCS path for deletion
  position:    integer("position").notNull().default(0),
  createdAt:   timestamp("created_at").defaultNow(),
});

export const insertStorySchema = createInsertSchema(storiesTable);
export const insertPhotoSchema = createInsertSchema(storyPhotosTable).omit({ id: true, createdAt: true });

export type Story      = typeof storiesTable.$inferSelect;
export type StoryPhoto = typeof storyPhotosTable.$inferSelect;
export type InsertStory      = z.infer<typeof insertStorySchema>;
export type InsertStoryPhoto = z.infer<typeof insertPhotoSchema>;
