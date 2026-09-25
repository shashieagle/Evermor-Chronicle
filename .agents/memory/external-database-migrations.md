---
name: External database migrations
description: Safety boundaries when moving Evermor data from Replit production to an external PostgreSQL host.
---

Use the published production database as the source for external migrations, not the workspace development database. Use a direct, unpooled Neon connection for dump/restore, verify the destination before writing, and compare source and destination content after the copy. A database migration does not transfer photos or the admin snapshot stored in Replit Object Storage.

**Why:** Development and production held different records, and production photo counts changed while a copy was being prepared. A schema-only migration or an unchecked dump could miss live content; photo rows alone do not make media accessible from an external API host.

**How to apply:** Keep the existing Replit deployment as fallback until a final production-data sync and separate object-file migration have been verified. Obtain connection credentials through secure secrets, never paste or log them, and avoid overwriting a populated destination without explicit approval.