---
name: chronoshub-pptx
description: >
  Generates a polished PowerPoint presentation for ChronosHub using their official branded template. Use this skill whenever someone asks to create a presentation, deck, slides, or pitch using ChronosHub branding or the ChronosHub template. The skill encodes the complete design system (colors, fonts, typography scale) and full slide catalog (70 slides across 14 types). Always use this skill for any ChronosHub presentation work — even if the user just says "make me a deck" without specifying the template. Also use it when editing, updating, or adding slides to an existing ChronosHub presentation.
---

# ChronosHub Presentation Skill

This skill creates presentations using the **ChronosHub Presentation Template (Winter 2025)**.

> **Template:** bundled at `$SKILL_DIR/references/ChronosHub Presentation Template (Winter 2025).potx`

---

## Quick Workflow

1. **Confirm scope with the user.** Before building, clarify anything ambiguous:
   - Mode: new deck (one-shot or incremental) or edit an existing deck?
   - Content source: vault note, document, in-prompt notes, or the conversation so far?
   - If the content isn't ready yet, develop the content with the user first; pick layouts afterwards.
   Skip questions where the answer is already clear from the conversation.

2. **Plan slides.** Map content sections to slide types (see Slide Catalog).

3. **Set up the working directory.** Unpack the .potx template for a new deck, or the user's existing .pptx for an edit (see Setup).

4. **Rewrite `presentation.xml`** to keep only the slides you want, in the final order.

5. **Edit slide XML** to replace placeholder text with real content.

6. **Clean, pack, visually QA.** Render to PDF and inspect each page.

---

## Setup

Set these paths before any commands. The **pptx** skill is a separate installation that provides shared OOXML scripts.

```bash
SKILL_DIR="<path to installed chronoshub-pptx skill>"
PPTX_SCRIPTS="<path to installed pptx skill's scripts folder>"
```

### New deck (start from template)

```bash
cp "$SKILL_DIR/references/ChronosHub Presentation Template (Winter 2025).potx" /tmp/chronoshub-work.pptx
python $PPTX_SCRIPTS/office/unpack.py /tmp/chronoshub-work.pptx /tmp/chronoshub-unpacked/
python $SKILL_DIR/scripts/fix_content_type.py /tmp/chronoshub-unpacked/
```

`fix_content_type.py` is required: it patches the content type from `.potx` (template) to `.pptx` (presentation). Without it, PowerPoint will refuse to open the output file.

### Edit existing deck

```bash
python $PPTX_SCRIPTS/office/unpack.py /path/to/user-file.pptx /tmp/chronoshub-unpacked/
```

No `fix_content_type.py` needed; the user's file is already a `.pptx`.

---

## Design System

### Text
Don't use "—", instead use "," or ";" depending on the context.

### Colors

Use accent colors to emphasize and categorize things.
Use three or fewer colors per slide to not weaken emphasis and dilute categorization.
DO NOT let accent colors dominate the primary color on a slide.

| Hex | Name | Usage |
|-----|------|-------|
| `#06296B` | **Marine** | Use this color for subtle accent text, such as significant words and terms as parts of longer phrases and sentences. |
| `#16162E` | **Indigo** | Use this color for graphical sections, such as backgrounds or containers. Use also for text on lighter backgrounds to soften the contrast. |
| `#63419F` | **Violet** | Use this color for subtle accent text, such as significant words and terms as parts of longer phrases and sentences. |
| `#F3F1EF` | **Ivory** | Use this color for graphical sections, such as backgrounds or containers. Use also for text on darker backgrounds to soften the contrast. |
| `#000000` | **Black** | Use this color for majority of the text, including titles, headings, quotes, main bodies, descriptions, captions, annotations, and others. |
| `#FFFFFF` | **White** | Use this color for background and container fills with lighter content, or foreground and element strokes with darker content. |

### Typography

Use accent text styles to emphasize and categorize things. Use three or fewer styles per slide to not weaken emphasis and dilute categorization. The style attributes are relative to the default slide size 1920 x 1080 px (16:9).

- **Sora**: use for Display copy. Larger sizes. Smaller quantities. Use for titles, headings, quotes, and other copy that needs emphasis and impact. (`Sora Light`, `Sora Regular`, `Sora Bold`, `Sora Medium`)
- **Public Sans**: use for Text copy. Smaller size. Larger quantities. Use for main bodies, descriptions, captions, annotations, and other copy that forms the main content. (`Public Sans Regular`, `Public Sans Bold`)

**Scale (relative to 1920×1080 slide):**

| Style | Size | Weight | Line Height | Use For |
|-------|------|--------|-------------|---------|
| Display XLarge | 78pt (`sz="7800"`) | Regular/Bold | 0.8–1.0 | Big stat callouts, hero headlines |
| Display Large | 66pt (`sz="6600"`) | Regular/Bold | 0.8–1.0 | Cover titles (large) |
| Display Medium | 54pt (`sz="5400"`) | Regular/Bold | 0.8–1.0 | Cover titles, section headers |
| Display Small | 42pt (`sz="4200"`) | Regular/Bold | 0.8–1.0 | Slide titles, agenda headings |
| Text Medium | 36pt (`sz="3600"`) | Regular/Bold | 1.2–1.4 | Subheadings, highlight text |
| Text Regular | 32pt (`sz="3200"`) | Regular/Bold | 1.2–1.4 | Body headers |
| Text Small | 28pt (`sz="2800"`) | Regular | 1.2–1.4 | Body text |
| Text XSmall | 24pt (`sz="2400"`) | Regular | 1.2–1.4 | Captions, annotations |

### Icons

Use icons that relate to the meaning of a word, term, phrase, or sentence to enhance the message. Use icons that are simple to ensure clarity and use them sparingly to avoid clutter. Icons are from this collection: https://phosphoricons.com/. A pre-downloaded subset is bundled at `$SKILL_DIR/references/icons/`. Keep the icons names in mind when writing the text for the slides.

### Logos

Three logo variants live at `$SKILL_DIR/references/logos/`:
- `logo-full-color.png`: light/neutral backgrounds (Ivory, white)
- `logo-white.png`: dark backgrounds (Indigo, Marine, Violet)
- `logo-black.png`: very-light backgrounds where full-color has insufficient contrast

Logos are inherited from slide layouts on content slides; do not add them manually. For per-slide-type variant rules and source paths in the template, see `$SKILL_DIR/references/logos.md`.

---

## Slide Catalog

The template contains 70 slides across 14 types. **You will only use a small subset of these per deck.**

- **Usable slides** are the actual content layouts — pick the ones you need
- **⛔ Instruction slides** (black background with italic label like "The deck opening slide") are template annotations — **never include these in output**
- **⛔ Brand reference slides** (slides 64–70: typography, colors, icons, logos) — **never include these in output**

Always work from an existing slide using `add_slide.py` to duplicate if you need multiple copies of the same layout. Never build slides from scratch.

See `references/slide-catalog.md` for the complete mapping of all 70 slides.

### Cover / Opening  
`slide1.xml` (Indigo) · `slide4.xml` (Violet) · `slide5.xml` (Ivory)  
`slide3.xml` (Indigo alt with subtitle)

**When to use:** First slide of every deck. Pick a background color based on tone:
- **Indigo** (dark navy) — default, most formal/premium
- **Violet** (purple) — energetic, bold, product-led
- **Ivory** (cream/light) — clean, minimal, investor/external

**Fields:** Deck title, subtitle (optional), date (format: `YY-MM-DD`)

---

### Agenda  
`slide7.xml` (1-column) · `slide8.xml` (2-column grid)

**When to use:** Longer talks (5+ sections) that benefit from a table of contents. Skip for short decks.

**Fields:** Up to 6 numbered items with a heading label per item. Use `slide8.xml` when you have 4–6 items (2×3 grid).

---

### Speaker Intro  
`slide10.xml` (1–4 people) · `slide11.xml` (5–9 people)

**When to use:** Introducing presenters or a team. Includes circular photo placeholders, name, and role fields. 

**Fields:** `Full Name`, `Role` per person. Replace circular image placeholders with actual photos if available.

---

### Atmospheric Highlight  
`slide13.xml`–`slide18.xml` (6 variants: dark/light × image-left/right/full-bleed)

**When to use:** Set context, tell a story, provide background, or create an emotional beat. Pairs a short bold headline with a large atmospheric image. Don't use for data or detailed content.

**Fields:** `Highlight` (headline, bold, Sora, ~54pt), body paragraph (1–3 sentences max), image placeholder.

**Variants:**
- `slide13.xml` — dark overlay, image right, landscape
- `slide14.xml` — light/cream, image right
- `slide15.xml` — image fills full right half, light
- `slide16.xml` — image fills full left half, light
- `slide17.xml` — dark tinted overlay over image
- `slide18.xml` — fully dark, atmospheric

---

### Attention Highlight  
`slide20.xml`–`slide25.xml` (6 color variants: Indigo, Violet, Marine, Ivory, Black, White)

**When to use:** Single-focus moment — one important insight, quote teaser, or key message (text based). Two-panel layout: text label left, large callout text right. Use sparingly — max 1–2 per deck.

**Fields:** `Highlight` (label, left panel), main statement (right panel, large Sora).

**Color variants by slide:**
- `slide20.xml` — white bg + Marine (blue) right panel
- `slide21.xml` — white bg + Violet (purple) right panel  
- `slide22.xml` — white bg + Ivory (cream) right panel
- `slide23.xml` — white bg + Indigo right panel
- `slide24.xml` — Indigo bg + Violet right panel
- `slide25.xml` — Indigo bg + Ivory right panel

---

### Main Highlight (Single)  
`slide27.xml` (number/stat + description, light bg) · `slide28.xml` (icon + description, light bg)

**When to use:** Emphasize one critical metric, objective, or insight with a big visual anchor (number or icon). The number/icon dominates the left; heading + description sit right.

**Fields:** Big number or icon (left), `Main highlight` heading (right, bold), description text (right, ~28pt), optional caption below number.

---

### Main Highlights (Multi-column cards)  
`slide29.xml` (3 dark cards, Indigo) · `slide30.xml` (3 light cards, Ivory)

**When to use:** Present 3 values, principles, pillars, or use cases side by side. Each card has a title and body.

**Fields:** Section title (`Main highlights`), 3× item label (top, small) + item heading (bottom, 36pt bold).

---

### Text / Prose  
`slide32.xml`

**When to use:** Dense explanatory content — plans, definitions, summaries. Use Sora Bold for slide title (~42pt), Public Sans Regular for body (~28pt). Keep body to 3–4 short paragraphs max. The template recommends minimal use.

**Fields:** Slide title, body paragraphs.

---

### List of Items  
`slide34.xml` (1-column) · `slide35.xml` (2-column) · `slide36.xml` (3-column) · `slide37.xml` (2-column, more items)

**When to use:** Communicate a category, collection, or group of items — each with a short heading and 1–2 sentence description. Choose column count based on number of items: 1-col for 2–3 items, 2-col for 4–6, 3-col for 6–9.

**Fields:** Section label (`List of items`), per-item heading (bold) + description.

---

### Object / Product Showcase  
`slide39.xml` (Black accent, image right) · `slide40.xml` (Marine accent) · `slide41.xml` (Violet accent)  
`slide42.xml` (full-bleed image) · `slide43.xml` (2 images + characteristics) · `slide44.xml` (3 characteristics)

**When to use:** Demonstrate a product, tool, interface, or concept. Large image dominates; text is subordinate. Link slides if the user will navigate from here.

**Fields:** `Present an object` title, description sentence, optional link/label. For `slide43`/`slide44`: characteristic headings + descriptions.

---

### Key Metrics  
`slide46.xml` (3 metrics, vertical list) · `slide47.xml` (4 metrics, 2×2) · `slide48.xml` (3 metrics, horizontal) · `slide49.xml` (4 metrics, horizontal)

**When to use:** Show KPIs, growth indicators, or goals. Large bold numbers with short labels. Also works for coordinating goals and expectations.

**Fields:** `Key metrics` heading, per-metric: number (Display Large, ~66pt bold Sora), label heading (bold), description (body).

---

### Timeline  
`slide51.xml` (simple) · `slide52.xml` (expanded, 5+ events)

**When to use:** Sequential events — roadmap, milestones, process steps, history. Horizontal flow with date markers.

**Fields:** `Timeline` heading, per-event: event name (bold), date (`DD. Mon. YYYY`), description.

---

### Quote  
`slide54.xml` (single quote) · `slide55.xml` (3 quotes side by side)

**When to use:** Highlight a striking testimonial, customer quote, or stakeholder statement. Use `slide54` for one powerful quote; `slide55` for a collection.

**Fields:** Quote text (in `&#x201C;...&#x201D;`), `Full Name`, `Designation · Organization`.

---

### Section Divider  
`slide57.xml` (Marine blue) · `slide58.xml` (Indigo) · `slide59.xml` (Ivory)

**When to use:** Separate major sections of a long deck. Background fills the whole slide with the ChronosHub arc motif. One large text field.

**Fields:** `Section title` (large Sora, ~78pt, white on dark variants / black on Ivory).

---

### Closing / Outro  
`slide61.xml` (Marine) · `slide62.xml` (Violet) · `slide63.xml` (Ivory)

**When to use:** Final slide of the deck — mirrors the opening in color choice. Contains the `ChronosHub` wordmark logo.

**Fields:** `Slide deck outro` (or replace with a closing statement / CTA / contact info, keep in mind to always capitalize at the start of a sentence).

---

## Presentation Planning Guide

### Typical deck structure
```
1. Cover (Opening)
2. Agenda (if 5+ sections)
3–N. Content slides
   - Use Atmospheric Highlight to open each major section
   - Use Main Highlight, Metrics, Lists for substance
   - Use Attention Highlight sparingly for key moments
   - Use Section Dividers between chapters
N+1. Closing
```

### Color/background picking logic
- **Formal / investor / external** → Indigo opening, Indigo dividers, Marine or Indigo closing
- **Product / team** → Violet opening, Violet or Marine closing
- **Clean / minimal** → Ivory opening, Ivory dividers, Ivory closing

Be consistent with color use, example: if you've chosen Indigo for the opening don't use Violet on other slides.

### Typography application
- Slide titles: **Sora Bold, 42pt** (sz="4200")
- Large stats/numbers: **Sora Bold, 66–78pt** (sz="6600"–"7800")
- Section headings within a slide: **Sora Bold, 36pt** (sz="3600")
- Body / descriptions: **Public Sans Regular, 28pt** (sz="2800")
- Captions / annotations: **Public Sans Regular, 24pt** (sz="2400")
- Accent / emphasis words inline: wrap in Marine (`#06296B`) or Violet (`#63419F`)

---

## Building the Presentation (Step by Step)

### 1. Unpack and fix content type

```bash
SKILL_SCRIPTS="<path to pptx skill scripts>"
SKILL_DIR="<path to installed skill folder>"

cp "$SKILL_DIR/references/ChronosHub Presentation Template (Winter 2025).potx" /tmp/chronoshub.pptx
python $SKILL_SCRIPTS/office/unpack.py /tmp/chronoshub.pptx /tmp/chronoshub-unpacked/

# REQUIRED: patch the content type from .potx (template) to .pptx (presentation)
# Without this, PowerPoint will refuse to open the output file
python $SKILL_DIR/scripts/fix_content_type.py /tmp/chronoshub-unpacked/
```

### 2. Plan your exact slide list

Before touching any XML, write down the **exact slide filenames** you will use, one per content section. Be specific — e.g. `slide1.xml` (Indigo cover), `slide46.xml` (3 metrics), `slide61.xml` (Marine closing).

The output deck should have **only the slides the content needs** — typically 4–10. A 5-point update deck should not have 70 slides. 

Use the catalog in `references/slide-catalog.md` to pick the right variant for each section.

### 2b. Validate your slide choices

Before touching `presentation.xml`, open the XML of each chosen slide and read every `<a:t>` text node. This takes one `cat` command per slide.

**Every non-heading text element is an instruction, not only a content example.** The placeholder text tells you *how* to write — formatting directives ("Add line breaks based on speech flow"), length guidance ("Write concise and clear text"), structural hints ("Name each item in the heading field") — none of it is filler. Read it all before writing a single word of real content.

For each slide, ask: *does this slide's structure and instructions match what I'm trying to communicate?* If the answer is no for any slide, re-consult the catalog and pick a better fit before proceeding. Only move to step 3 once every chosen slide genuinely fits its content.

Before locking in your slide list, ask for each planned slide: "What unique point does this slide make that no other slide in the deck makes?" If you can't answer in one sentence, cut or merge it. 

---

### 3. ⚠️ Rewrite presentation.xml to contain ONLY your chosen slides

This is the most critical step. The template has 70 slides — you must strip it down to just the ones you're using.

Open `ppt/presentation.xml` and find the `<p:sldIdLst>` block. It looks like:

```xml
<p:sldIdLst>
  <p:sldId id="256" r:id="rId2"/>
  <p:sldId id="257" r:id="rId3"/>
  ... (70 entries)
</p:sldIdLst>
```

**Find which rId maps to each slide file** by reading `ppt/_rels/presentation.xml.rels`. Each entry looks like:
```xml
<Relationship Id="rId2" Type=".../slide" Target="slides/slide1.xml"/>
```

**Rewrite the `<p:sldIdLst>` to contain ONLY the `<p:sldId>` entries for your chosen slides.** Delete all others. Example for a 4-slide deck using slide1, slide46, slide10, slide61:

```xml
<p:sldIdLst>
  <p:sldId id="256" r:id="rId2"/>   <!-- slide1.xml: Indigo cover -->
  <p:sldId id="301" r:id="rId47"/>  <!-- slide46.xml: metrics -->
  <p:sldId id="265" r:id="rId11"/>  <!-- slide10.xml: team -->
  <p:sldId id="316" r:id="rId62"/>  <!-- slide61.xml: Marine closing -->
</p:sldIdLst>
```

Then run `clean.py` to remove the orphaned slide files:
```bash
python $SKILL_SCRIPTS/clean.py /tmp/chronoshub-unpacked/
```

**Verify it worked:**
```bash
grep -c '<p:sldId ' /tmp/chronoshub-unpacked/ppt/presentation.xml
# Should match your planned slide count (e.g. 4, 6, 8)
```

If the count is wrong, **stop and fix it** before proceeding.

To **duplicate** a slide you need multiple copies of (e.g. two quote slides):
```bash
python $SKILL_SCRIPTS/add_slide.py /tmp/chronoshub-unpacked/ slide54.xml
# Prints a new <p:sldId> element — insert it at the right position in <p:sldIdLst>
```

### 4. Edit content

For each slide in your deck: read the XML, find all `<a:t>` text nodes, replace placeholder text with real content. Use the Edit tool — not sed or Python.

**Before writing anything:** every non-heading `<a:t>` in the original template is an instruction. Go back to your Step 2b notes and apply every directive you found — line break guidance, length guidance, structural guidance — when writing the replacement content. Do not treat these as text to discard; treat them as the spec for your content.

**Key rules:**
- Slide title: find the `<a:t>` in the text box with `sz="4200"` and Sora Bold
- Preserve all `<a:rPr>` attributes (size, font, color) — only change `<a:t>` content
- For multiple list items: use separate `<a:p>` elements, never concatenate into one
- For color accents on words: wrap the run with `<a:solidFill><a:srgbClr val="06296B"/></a:solidFill>` on `<a:rPr>`
- Smart quotes: use `&#x201C;` (") and `&#x201D;` (")

### 5. Pre-pack checks

Before packing, verify:

```bash
# 1. Correct slide count
grep -c '<p:sldId ' /tmp/chronoshub-unpacked/ppt/presentation.xml

# 2. No leftover placeholder text
grep -r "Use this to\|Full Name\|First thing\|First item\|First event\|Slide deck title\|Add a short desc\|Name each item\|Write concise" \
  /tmp/chronoshub-unpacked/ppt/slides/ | grep "<a:t>"
```

If the grep finds anything, go back and fix those slides. Do not skip this step.

### 6. Clean + Pack

```bash
python $SKILL_SCRIPTS/clean.py /tmp/chronoshub-unpacked/
python $SKILL_SCRIPTS/office/pack.py /tmp/chronoshub-unpacked/ /tmp/output.pptx --original /tmp/chronoshub.pptx
```

### 7. Visual QA

```bash
python $SKILL_SCRIPTS/office/soffice.py --headless --convert-to pdf /tmp/output.pptx
pdftoppm -jpeg -r 150 /tmp/output.pdf /tmp/slide
ls /tmp/slide-*.jpg
```

Inspect each slide image. Look for: text overflow, leftover placeholder text, misaligned elements, wrong colors, font fallbacks.

---

## Common Pitfalls

- **Font names must be exact**: `"Sora Bold"`, `"Sora Light"`, `"Sora Regular"`, `"Sora Medium"`, `"Public Sans Regular"`, `"Public Sans Bold"`. A typo silently falls back to a system font.
- **Don't mix fonts arbitrarily**: Sora for display/headlines, Public Sans for body. Mixing other fonts breaks the brand.
- **Image placeholders**: The template's photo slots are `<p:pic>` elements with `r:embed` pointing to placeholder images. Replace the image file in `/ppt/media/` and update the rel if needed — or keep placeholder and note it to the user.
- **Don't remove the logo**: The ChronosHub logo appears via the layout (`slideLayout2.xml` etc.) — it's inherited, don't try to add it manually to individual slides.
- **Color token discipline**: If you need to emphasize text, use Marine (`06296B`) or Violet (`63419F`) — not arbitrary colors. Never introduce new brand colors.
- **Slide count per section**: The template's "blank" label slides (slide2, slide6, slide9, etc.) are **instruction separators** in the template — delete all of them in your output deck.
