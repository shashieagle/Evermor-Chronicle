---
name: Admin password deployment
description: How admin password changes reach the live Evermor site
---

# Admin password deployment

Changing the `ADMIN_PASSWORD` secret updates the development environment immediately, but the published API process keeps its previous environment until the app is republished.

**Why:** The admin panel validates the token against the API process environment, and production is a separate running process.

**How to apply:** After securely setting a new `ADMIN_PASSWORD`, restart the API for local verification and republish the app before asking the user to test `https://evermortales.com/admin`. Never display or retrieve the secret value.