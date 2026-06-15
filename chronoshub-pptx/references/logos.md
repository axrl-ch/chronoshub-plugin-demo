# ChronosHub Logo Reference

Three logo variants are available in `references/logos/`. Always use the correct variant for the slide background — never place a full-color logo on a dark background or a white logo on a light background.

---

## Variants

### Full Color — `logo-full-color.png`
- Two-tone wordmark: "Chronos" in black, "Hub" in cyan blue
- **Use on:** Light/neutral backgrounds — Ivory slides, white-background content slides
- **Slides:** All content slides (inherited from layout — do not add manually)
- **Source in template:** `ppt/media/image1.png`

### White — `logo-white.png`
- Full white wordmark
- **Use on:** Dark backgrounds — Indigo, Marine, Violet slides
- **Slides:** Cover slides (Indigo/Violet variants), Section Dividers (Marine/Indigo), Closing slides (Marine/Violet)
- **Source in template:** `ppt/media/image43.png`

### Black — `logo-black.png`
- Full black wordmark
- **Use on:** Very light or white backgrounds where the full-color version has insufficient contrast
- **Slides:** Cover slides (Ivory variant), Closing slide (Ivory)
- **Source in template:** `ppt/media/image44.png`

---

## Usage Rules

- **Do not add the logo manually to content slides** — it is inherited from the slide layout and will appear automatically.
- Only replace or insert logos explicitly on Cover, Section Divider, and Closing slides where the layout does not inherit it, or when swapping a placeholder image.
- When copying a logo into an unpacked presentation's media folder, update the corresponding `.rels` file if you are adding a new image reference rather than replacing an existing one.
- Logo dimensions: 4001 × 607 px (high resolution — scale down as needed, never up).
- Maintain aspect ratio at all times — never stretch or distort the wordmark.
