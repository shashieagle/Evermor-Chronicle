---
name: External database migrations
description: Safety boundaries when moving Evermor data from Replit production to an external PostgreSQL host.
---

Use the published production database as the source for external migrations, not the workspace development database. Use a direct, unpooled Neon connection for dump/restore, verify the destination before writing, and compare source and destination content after the copy. A database migration does not transfer photos or the admin snapshot stored in Replit Object Storage.

**Why:** Development and production held different records, and production photo counts changed while a copy was being prepared. A schema-only migration or an unchecked dump could miss live content; photo rows alone do not make media accessible from an external API host.

**How to apply:** Keep the existing Replit deployment as fallback until a final production-data sync and separate object-file migration have been verified. Obtain connection credentials through secure secrets, never paste or log them, and avoid overwriting a populated destination without explicit approval.

Before copying object files, compare the referenced media keys in source and destination as well as row counts, and check the destination schema against the code that will query it. A matching data copy can still lack nullable columns added later by the application.

**Why:** An image manifest query failed on a missing optional column even though the source and destination media references matched; a count-only check would not have exposed the schema drift.

**How to apply:** Make only necessary additive schema changes after confirming the external target, use a read-only manifest query, and preserve source objects and existing object keys until read-back verification succeeds.