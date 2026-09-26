---
name: Story content visibility
description: Visibility rules for writing and film on individual Beginnings pages.
---

The narrative, pause, and reflection copy must remain visible even before their scroll observer fires; animation may move the text but must not make critical writing depend on `opacity: 0`.

**Why:** Browser scroll restoration and fast scrolling can prevent or delay the observer transition, leaving a large empty white section even though the story data and DOM content are present.

**How to apply:** When changing Beginnings page animations, keep the three writing sections at full opacity by default and limit observer-driven effects to non-blocking transforms.

The Film section must also remain visible without a scroll observer. When observing sections that appear only after an asynchronous story fetch, attach the observer when the element mounts rather than only on the initial loading render.

**Why:** The page can first render without the Film section; a mount-only observer finds no element and never runs again, leaving an opacity-hidden film inaccessible even when the saved video URL is valid.

**How to apply:** Keep critical media opaque by default. Use an element-aware callback ref for any optional animation on asynchronously rendered sections.