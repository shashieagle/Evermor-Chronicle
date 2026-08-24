import assert from "node:assert/strict";
import { after, beforeEach, test } from "node:test";
import { eq, inArray } from "drizzle-orm";
import {
  db,
  pool,
  slideshowPhotosTable,
  storiesTable,
  storyPhotosTable,
} from "@workspace/db";
import { applySeedSnapshot, seedIfEmpty, type DbSnapshot } from "./seed";

const EXISTING_SLUG = "__seed-regression-existing__";
const EXTRA_SLUG = "__seed-regression-extra__";
const SNAPSHOT_SLUG = "__seed-regression-snapshot__";
const SLIDESHOW_URL = "__seed-regression-slideshow__";

function storyValues(slug: string, title: string) {
  return {
    slug,
    title,
    couple: "Test Couple",
    location: "Test Location",
    heroImage: "/test-image.jpg",
    hasFilm: false,
  };
}

function snapshotFor(stories: DbSnapshot["stories"]): DbSnapshot {
  return { stories, storyPhotos: [], slideshow: [] };
}

beforeEach(async () => {
  await db.delete(storyPhotosTable).where(
    inArray(storyPhotosTable.storySlug, [EXISTING_SLUG, EXTRA_SLUG, SNAPSHOT_SLUG]),
  );
  await db.delete(storiesTable).where(
    inArray(storiesTable.slug, [EXISTING_SLUG, EXTRA_SLUG, SNAPSHOT_SLUG]),
  );
  await db.delete(slideshowPhotosTable).where(eq(slideshowPhotosTable.url, SLIDESHOW_URL));
});

after(async () => {
  await db.delete(storyPhotosTable).where(
    inArray(storyPhotosTable.storySlug, [EXISTING_SLUG, EXTRA_SLUG, SNAPSHOT_SLUG]),
  );
  await db.delete(storiesTable).where(
    inArray(storiesTable.slug, [EXISTING_SLUG, EXTRA_SLUG, SNAPSHOT_SLUG]),
  );
  await db.delete(slideshowPhotosTable).where(eq(slideshowPhotosTable.url, SLIDESHOW_URL));
  await pool.end();
});

test("applySeedSnapshot upserts stories without replacing stories or slideshow data outside the snapshot", async () => {
  await db.insert(storiesTable).values([
    storyValues(EXISTING_SLUG, "Original title"),
    storyValues(EXTRA_SLUG, "Keep this story"),
  ]);
  await db.insert(storyPhotosTable).values({
    storySlug: EXISTING_SLUG,
    url: "__seed-regression-old-photo__",
    position: 0,
  });
  await db.insert(slideshowPhotosTable).values({
    url: SLIDESHOW_URL,
    position: 0,
  });

  await applySeedSnapshot(snapshotFor([{
    ...storyValues(EXISTING_SLUG, "Edited title"),
    couple: "Edited Couple",
    narrative: "Edited narrative",
    pause: null,
    reflection: "Edited reflection",
    videoUrl: "https://example.com/film",
    hasFilm: true,
    heroImage: "/edited-image.jpg",
  }]));

  const stories = await db.select().from(storiesTable).where(
    inArray(storiesTable.slug, [EXISTING_SLUG, EXTRA_SLUG]),
  );
  const existing = stories.find((story) => story.slug === EXISTING_SLUG);
  assert.equal(existing?.title, "Edited title");
  assert.equal(existing?.narrative, "Edited narrative");
  assert.equal(existing?.hasFilm, true);
  assert.equal(stories.some((story) => story.slug === EXTRA_SLUG), true);

  const slideshow = await db.select().from(slideshowPhotosTable).where(
    eq(slideshowPhotosTable.url, SLIDESHOW_URL),
  );
  assert.equal(slideshow.length, 1);
});

test("seedIfEmpty applies a valid snapshot and skips hardcoded seeding", async () => {
  let fallbackCalled = false;
  const snapshot = snapshotFor([{
    ...storyValues(SNAPSHOT_SLUG, "Snapshot story"),
    narrative: null,
    pause: null,
    reflection: null,
    videoUrl: null,
    hasFilm: false,
    heroImage: "/snapshot-image.jpg",
  }]);

  await seedIfEmpty({
    readSnapshot: async () => snapshot,
    seedFallback: async () => {
      fallbackCalled = true;
    },
  });

  const [story] = await db.select().from(storiesTable).where(eq(storiesTable.slug, SNAPSHOT_SLUG));
  assert.equal(story?.title, "Snapshot story");
  assert.equal(fallbackCalled, false);
});