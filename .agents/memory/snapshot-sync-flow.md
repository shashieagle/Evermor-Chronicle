---
name: Snapshot sync flow
description: How story/photo data persists across API server restarts — critical for copy edits
---

# Snapshot sync flow

On every API server restart, `seedIfEmpty()` reads `sync/snapshot.json` from object storage and upserts it into the DB. This means any DB change made via the admin API is **lost on restart** unless the snapshot is also updated.

**Rule:** After any admin PUT/PATCH to story fields (narrative, reflection, pause, etc.), always follow with:
```
POST http://localhost:8080/api/admin/sync
Header: x-admin-token: $ADMIN_PASSWORD
```
This writes the current DB state back to `sync/snapshot.json` in object storage, making the change durable.

**Why:** The snapshot is the production source of truth — it survives redeploys and server restarts. The DB alone does not.

**How to apply:** Every time copy is edited via `curl -X PUT /api/admin/stories/:slug`, immediately follow with `curl -X POST /api/admin/sync`. Both calls use `x-admin-token` header (not Basic Auth). API server runs on port 8080 in dev (not 19471 — that was an old assumption).

**Also:** `artifacts/evermor/src/data/stories.ts` is a static fallback used for initial render before the API fetch completes. Keep it in sync with DB changes to avoid flash of stale content.

## Live admin edits before publishing

The production admin database can contain newer story titles and copy than the workspace database and static fallback. A deployment based only on the workspace can therefore overwrite or mask edits the user already made live.

**Why:** Admin changes are persisted in the running environment, while the workspace's seed and fallback data do not update automatically.

**How to apply:** Before publishing after live admin work, compare the production admin story records with the workspace. Treat the live records as the source of truth, bring changed title/copy fields into the workspace seed and fallback data, then create a fresh active-story snapshot before deployment.

## Archived stories

Archived stories must be excluded from snapshots. Otherwise a later server restart can upsert them back as active because the snapshot format does not carry an archive date.

**Why:** Archiving is meant to hide a story from public routes while retaining it for restoration in Admin.

**How to apply:** Sync only active stories and their photos after archiving. The archived row remains in the DB with its archive date and can be restored later.
