---
name: Logo files
description: Evermor Tales logo PNGs with transparent backgrounds, placed in public dir
---

# Logo files

Two logo variants saved to `artifacts/evermor/public/`:
- `logo-icon.png` — compact/small version (from `attached_assets/4_1785767310474.png`), used in Nav
- `logo-mark.png` — full/large version (from `attached_assets/3_1785767338085.png`), available for footer/print

Black backgrounds removed via: `magick <input> -fuzz 15% -transparent black <output>`

**Nav usage:** Logo icon shown at `h-9` alongside "Evermor Tales" text. On dark theme, CSS filter applied: `brightness(0) invert(1) sepia(1) saturate(2) hue-rotate(5deg)` to make dark elements visible on dark backgrounds.
