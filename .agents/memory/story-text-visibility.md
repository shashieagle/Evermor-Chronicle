---
name: Story text visibility
description: Visibility rule for the three-part writing on individual Beginnings pages.
---

The narrative, pause, and reflection copy must remain visible even before their scroll observer fires; animation may move the text but must not make critical writing depend on `opacity: 0`.

**Why:** Browser scroll restoration and fast scrolling can prevent or delay the observer transition, leaving a large empty white section even though the story data and DOM content are present.

**How to apply:** When changing Beginnings page animations, keep the three writing sections at full opacity by default and limit observer-driven effects to non-blocking transforms.