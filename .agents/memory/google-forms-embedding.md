---
name: Google Forms embedding
description: The URL requirement for rendering the Story DNA Google Form inside the Evermor site.
---

Use the Google Form URL with `?embedded=true` for the on-page iframe; keep the standard `viewform` URL for links that open the complete form in a new tab.

**Why:** Google blocks the standard form view URL inside an iframe with a frame-ancestors policy, while its embed-specific URL renders the form correctly.

**How to apply:** Preserve separate full-form and embed URLs whenever the Story DNA form section is edited or moved.