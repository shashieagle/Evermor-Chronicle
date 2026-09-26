---
name: Scoped GitHub publishing
description: Safe GitHub publishing when the workspace Git remote lacks push authentication and checkpoints include uploaded attachments.
---

GitHub HTTPS fetches from the shell can work while pushes fail authentication, even when the Replit GitHub connection has repository write access. Use the connected GitHub API for a scoped write, checking the remote branch and file revision before updating.

**Why:** Workspace checkpoint history may include uploaded diagnostic attachments unrelated to the requested fix. Pushing the whole local branch could publish those files, while the shell remote may not have usable write credentials.

**How to apply:** Publish only the explicitly requested files through the connected API when shell authentication fails. Do not force-push or blindly merge local checkpoint history; reconcile the local branch separately before a future broad Git push.