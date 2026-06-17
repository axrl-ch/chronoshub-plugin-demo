---
name: chronoshub-pptx
description: >
  Creates polished PowerPoint presentations using the ChronosHub branded template. Use this skill for any presentation request — pitch decks, investor decks, product demos, team updates, customer presentations, reports, keynotes, or anything else. The template is always the foundation; content and structure adapt to the use case. Also use when editing, updating, or adding slides to an existing ChronosHub presentation.
---

# ChronosHub Presentation Skill

This skill creates presentations using the **ChronosHub Presentation Template (Winter 2025)**.

> **Template:** bundled at `$SKILL_DIR/references/ChronosHub Presentation Template (Winter 2025).potx`

The template defines the visual language. Your job is to select the right slides for the content at hand — not the other way around.

---

## Quick Workflow

1. **Understand the goal.** Before building, clarify anything ambiguous:
   - What is this presentation for? (pitch, update, demo, report, keynote, etc.)
   - Who is the audience? (investors, team, customers, partners, board)
   - What should the audience do or believe after seeing it?
   - How many slides / how long?
   - Content source: provided notes, a document, a conversation, or to develop together?

   Skip any question whose answer is already clear from context.

2. **Plan the narrative arc.** Define the story before picking slides. What are the 3–5 key points the audience must leave with? Structure the deck around those.

3. **Map content to slides.** Match each section to a slide type from the Slide Catalog. Choose the minimal set — a tight 6-slide deck beats a bloated 20-slide one.

4. **Set up the working directory.** Unpack the .potx template for a new deck, or the user's existing .pptx for an edit (see Setup).

5. **Rewrite `presentation.xml`** to keep only the slides you want, in order.

6. **Edit slide XML** to replace placeholder text with real content.

7. **Clean, pack, visually QA.**

---

## Setup

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
Don't use "—"; use "," or ";" depending on context.

### Colors

Use accent colors to emphasize and categorize. Use three or fewer colors per slide — more dilutes emphasis. Do not let accent colors dominate the primary color on a slide.

| Hex | Name | Usage |
|-----|------|-------|
| `#06296B` | **Marine** | Subtle accent text — significant words or terms within longer phrases |
| `#16162E` | **Indigo** | Graphical sections (backgrounds, containers); text on lighter backgrounds to soften contrast |
| `#63419F` | **Violet** | Subtle accent text — significant words or terms within longer phrases |
| `#F3F1EF` | **Ivory** | Graphical sections (backgrounds, containers); text on darker backgrounds to soften contrast |
| `#000000` | **Black** | Majority of text: titles, headings, quotes, bodies, captions |
| `#FFFFFF` | **White** | Background/container fills with lighter content; element strokes with darker content |

### Typography

Use three or fewer styles per slide. All sizes are relative to 1920×1080 px (16:9).

- **Sora**: display copy. Larger sizes, smaller quantities. Titles, headings, quotes, callouts.
  (`Sora Light`, `Sora Regular`, `Sora Bold`, `Sora Medium`)
- **Public Sans**: text copy. Smaller size, larger quantities. Bodies, descriptions, captions.
  (`Public Sans Regular`, `Public Sans Bold`)

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

Icons are from Phosphor Icons (https://phosphoricons.com/). A pre-downloaded subset is at `$SKILL_DIR/references/icons/`. Use icons that relate to the meaning of the content; keep them simple and use sparingly to avoid clutter.

### Logos

Three logo variants at `$SKILL_DIR/references/logos/`:
- `logo-full-color.png`: light/neutral backgrounds (Ivory, white)
- `logo-white.png`: dark backgrounds (Indigo, Marine, Violet)
- `logo-black.png`: very-light backgrounds where full-color has insufficient contrast

Logos are inherited from slide layouts on content slides — do not add them manually. For per-slide-type variant rules and source paths, see `$SKILL_DIR/references/logos.md`.

---

## Presentation Types Guide

Use this to shape the narrative arc and slide selection. The 14 slide types in the catalog are the same regardless of presentation type — this tells you which to prioritize and how to sequence them.

### Pitch Deck / Fundraising
**Goal:** Convince investors to engage further.
**Arc:** Problem → Solution → Why Now → Product → Market → Traction → Team → Ask
**Emphasis:** Attention Highlights for the problem/hook; Key Metrics for traction; Main Highlights for the solution; Timeline for roadmap; List of Items for market breakdown or team.
**Tone:** Indigo or Violet — confident, premium.

### Investor Update / Board Report
**Goal:** Build trust, demonstrate progress, surface decisions needed.
**Arc:** Summary → KPIs → Progress vs plan → Wins → Issues/risks → Next period focus
**Emphasis:** Key Metrics prominently; List of Items for wins and risks; Attention Highlights for critical decisions; Timeline for milestones.
**Tone:** Indigo — formal, data-driven.

### Product Demo / Launch
**Goal:** Make the audience want the product.
**Arc:** Problem → Solution overview → Product walkthrough → Key differentiators → Proof → Next steps
**Emphasis:** Object/Product Showcase for the UI or product; Atmospheric Highlights for emotional framing; Key Metrics for proof; Attention Highlights for key differentiators.
**Tone:** Violet — energetic, product-led.

### Customer / Sales Presentation
**Goal:** Move the deal forward — discovery, proposal, or close.
**Arc:** We understand your problem → Our solution → Why us → Proof → Next steps
**Emphasis:** Atmospheric Highlight to mirror their world; Main Highlights for the solution; List of Items for benefits; Quote for testimonials; Key Metrics for ROI.
**Tone:** Indigo for enterprise; Violet for modern/SaaS.

### Team / Internal Update (All Hands, Sprint Review)
**Goal:** Align the team, celebrate progress, set direction.
**Arc:** Recap → Metrics → Wins → Blockers → Focus areas → Closing
**Emphasis:** Key Metrics front and center; List of Items for initiatives; Attention Highlights for key messages; Timeline for roadmap; Speaker Intro for new faces.
**Tone:** Any — match the team energy.

### Conference Talk / Keynote
**Goal:** Inspire, educate, or provoke thinking.
**Arc:** Hook → Stakes → Core insight → Evidence → Implications → Call to action
**Emphasis:** Atmospheric Highlights for emotional beats; Attention Highlights for the big idea; Key Metrics for evidence; Quote for impact; Text/Prose sparingly.
**Tone:** Violet or Indigo depending on desired energy.

### Report / Briefing
**Goal:** Inform and enable a decision.
**Arc:** Executive summary → Context → Findings → Recommendations
**Emphasis:** Key Metrics for summary data; List of Items for findings; Text/Prose for nuanced explanation; Timeline for chronology.
**Tone:** Indigo or Ivory — clean and credible.

---

## Slide Catalog

The template contains 70 slides across 14 types. **Use only the slides your content needs** — typically 4–12 per deck.

- **Usable slides**: the content layouts — pick the ones you need
- **⛔ Instruction slides** (black background with italic label like "The deck opening slide"): template annotations — **never include in output**
- **⛔ Brand reference slides** (slides 64–70: typography, colors, icons, logos): **never include in output**

Always work from an existing slide using `add_slide.py` to duplicate. Never build slides from scratch.

See `references/slide-catalog.md` for the complete mapping of all 70 slides.

### Cover / Opening
`slide1.xml` (Indigo) · `slide4.xml` (Violet) · `slide5.xml` (Ivory)
`slide3.xml` (Indigo alt with subtitle)

**Every deck starts here.** Pick color based on tone:
- **Indigo** (dark navy) — default, most formal/premium
- **Violet** (purple) — energetic, bold, product-led
- **Ivory** (cream/light) — clean, minimal, investor/external

**Fields:** Deck title, subtitle (optional), date (`YY-MM-DD`)

---

### Agenda
`slide7.xml` (1-column) · `slide8.xml` (2-column grid)

Use for longer presentations (5+ sections) or when the audience needs orientation. Skip for short decks.

**Fields:** Up to 6 numbered items, each with a heading label. Use `slide8.xml` for 4–6 items.

---

### Speaker Intro
`slide10.xml` (1–4 people) · `slide11.xml` (5–9 people)

Use when introducing presenters, a team, or key people.

**Fields:** Circular image placeholder, `Full Name`, `Role` per person.

---

### Atmospheric Highlight
`slide13.xml`–`slide18.xml` (6 variants: dark/light × image placement)

Set context, tell a story, provide background, or create an emotional beat. A bold headline paired with a large atmospheric image. **Not for data or dense content.**

**Fields:** `Highlight` (headline, Sora Bold ~54pt), body (1–3 sentences max), image placeholder.

**Variants:** dark/image right (13), light cream/image right (14), image fills right half (15), image fills left half (16), dark tinted overlay (17), fully dark atmospheric (18).

---

### Attention Highlight
`slide20.xml`–`slide25.xml` (6 color variants)

A single-focus moment — one important insight, key message, or statement. Two-panel layout: short label left, large callout text right. **Use sparingly: max 1–2 per deck.**

**Fields:** Short label (left panel), main statement (right panel, large Sora).

**Color variants:** white+Marine (20), white+Violet (21), white+Ivory (22), white+Indigo (23), Indigo+Violet (24), Indigo+Ivory (25).

---

### Main Highlight (Single)
`slide27.xml` (number/stat + description) · `slide28.xml` (icon + description)

Emphasize one critical metric, objective, or insight with a big visual anchor. Number or icon dominates the left; heading + description sit right.

**Fields:** Big number or icon (left), heading (right, Sora Bold 36pt), description (right, Public Sans ~28pt), optional caption below number.

---

### Main Highlights (Cards)
`slide29.xml` (3 dark Indigo cards) · `slide30.xml` (3 light Ivory cards)

Present 3 values, principles, pillars, or use cases side by side.

**Fields:** Section title, 3× item label (top, small) + item heading (bottom, Sora Bold 36pt).

---

### Text / Prose
`slide32.xml`

Dense explanatory content — plans, definitions, summaries. Keep body to 3–4 short paragraphs. **Use minimally** — most content fits better in a structured layout.

**Fields:** Slide title (Sora Bold 42pt), body paragraphs (Public Sans 28pt).

---

### List of Items
`slide34.xml` (1-col) · `slide35.xml` (2-col) · `slide36.xml` (3-col) · `slide37.xml` (2-col more items)

A category, collection, or group of items with a short heading and 1–2 sentence description each. Match column count to item count: 1-col (2–3 items), 2-col (4–6), 3-col (6–9).

**Fields:** Section label, per-item: heading (bold) + description.

---

### Object / Product Showcase
`slide39.xml` (Black accent) · `slide40.xml` (Marine accent) · `slide41.xml` (Violet accent)
`slide42.xml` (full-bleed image) · `slide43.xml` (2 characteristics) · `slide44.xml` (3 characteristics)

Demonstrate a product, tool, interface, or concept. Large image dominates; text is subordinate.

**Fields:** Title, description (1–2 sentences), optional link/label. `slide43`/`44`: characteristic headings + descriptions per image.

---

### Key Metrics
`slide46.xml` (3 metrics, vertical) · `slide47.xml` (4 metrics, 2×2) · `slide48.xml` (3 metrics, horizontal) · `slide49.xml` (4 metrics, horizontal)

Show KPIs, growth indicators, goals, or proof points. Large bold numbers with short labels.

**Fields:** `Key metrics` heading, per-metric: number (Sora Bold 66pt), label heading (bold), description (Public Sans 28pt).

---

### Timeline
`slide51.xml` (3–4 events) · `slide52.xml` (5–6 events)

Sequential events — roadmaps, milestones, process steps, history. Horizontal flow with date markers.

**Fields:** `Timeline` heading, per-event: event name (bold), date (`DD. Mon. YYYY`), description.

---

### Quote
`slide54.xml` (single quote) · `slide55.xml` (3 quotes side by side)

A striking testimonial, customer quote, or stakeholder statement.

**Fields:** Quote text (in `&#x201C;...&#x201D;`), `Full Name`, `Designation · Organization`.

---

### Section Divider
`slide57.xml` (Marine) · `slide58.xml` (Indigo) · `slide59.xml` (Ivory)

Separate major sections in a long deck. Match divider color to the opening/closing color for consistency.

**Fields:** Section title (Sora ~78pt, white on dark variants / black on Ivory).

---

### Closing / Outro
`slide61.xml` (Marine) · `slide62.xml` (Violet) · `slide63.xml` (Ivory)

Final slide of every deck. Mirror the opening color choice. Contains the ChronosHub wordmark.

**Fields:** Closing statement, CTA, or contact info (always capitalize the first word of a sentence).

---

## Narrative Planning

### Deck structure skeleton
```
1. Cover
2. Agenda (if 5+ sections)
3–N. Content slides
   - Open major sections with an Atmospheric Highlight
   - Use Main Highlight / Metrics / Lists for the substance
   - Use Attention Highlight for the 1–2 moments that must land
   - Use Section Dividers between chapters in long decks
N+1. Closing
```

**Size discipline:** Every slide must earn its place. Ask: "What unique point does this slide make that no other slide makes?" If you can't answer in one sentence, cut or merge it.

### Color consistency
Pick one primary tone and stay with it throughout.
- **Formal / investor / external** → Indigo opening, Indigo or Marine dividers, Marine or Indigo closing
- **Product / energetic** → Violet opening, Violet or Marine closing
- **Clean / minimal** → Ivory opening, Ivory dividers, Ivory closing

Do not mix opening and closing colors — if the cover is Indigo, the closing is not Violet.

### Typography application
- Slide titles: **Sora Bold, 42pt** (`sz="4200"`)
- Large stats/numbers: **Sora Bold, 66–78pt** (`sz="6600"`–`"7800"`)
- Section headings within a slide: **Sora Bold, 36pt** (`sz="3600"`)
- Body / descriptions: **Public Sans Regular, 28pt** (`sz="2800"`)
- Captions / annotations: **Public Sans Regular, 24pt** (`sz="2400"`)
- Accent words inline: wrap in Marine (`06296B`) or Violet (`63419F`)

---

## Building the Presentation (Step by Step)

### 1. Unpack and fix content type

```bash
SKILL_SCRIPTS="<path to pptx skill scripts>"
SKILL_DIR="<path to installed skill folder>"

cp "$SKILL_DIR/references/ChronosHub Presentation Template (Winter 2025).potx" /tmp/chronoshub.pptx
python $SKILL_SCRIPTS/office/unpack.py /tmp/chronoshub.pptx /tmp/chronoshub-unpacked/

# REQUIRED: patch content type from .potx (template) to .pptx (presentation)
# Without this, PowerPoint will refuse to open the output file
python $SKILL_DIR/scripts/fix_content_type.py /tmp/chronoshub-unpacked/
```

### 2. Plan your exact slide list

Before touching any XML, write down the **exact slide filenames** you will use, one per content section — e.g. `slide1.xml` (Indigo cover), `slide46.xml` (3 metrics), `slide61.xml` (Marine closing).

Use `references/slide-catalog.md` to pick the right variant for each section.

### 2b. Validate your slide choices

Open the XML of each chosen slide and read every `<a:t>` text node. **Every non-heading text element is an instruction** — formatting directives, length guidance, structural hints. None of it is filler. Read it all before writing a single word of real content.

For each slide, ask: *does this slide's structure match what I'm trying to communicate?* If not, go back to the catalog and pick a better fit. Only move to step 3 once every slide genuinely fits its content.

Also ask: "What unique point does this slide make that no other slide in the deck makes?" If you can't answer in one sentence, cut or merge it.

### 3. ⚠️ Rewrite presentation.xml to contain ONLY your chosen slides

Open `ppt/presentation.xml` and find the `<p:sldIdLst>` block — it has 70 entries. Strip it to just the ones you're using.

Find the rId→file mapping in `ppt/_rels/presentation.xml.rels`:
```xml
<Relationship Id="rId2" Type=".../slide" Target="slides/slide1.xml"/>
```

Rewrite `<p:sldIdLst>` with only your chosen entries. Example for a 4-slide deck:
```xml
<p:sldIdLst>
  <p:sldId id="256" r:id="rId2"/>   <!-- slide1.xml: Indigo cover -->
  <p:sldId id="301" r:id="rId47"/>  <!-- slide46.xml: metrics -->
  <p:sldId id="265" r:id="rId11"/>  <!-- slide10.xml: team -->
  <p:sldId id="316" r:id="rId62"/>  <!-- slide61.xml: Marine closing -->
</p:sldIdLst>
```

Then remove orphaned slide files:
```bash
python $SKILL_SCRIPTS/clean.py /tmp/chronoshub-unpacked/
```

Verify it worked:
```bash
grep -c '<p:sldId ' /tmp/chronoshub-unpacked/ppt/presentation.xml
# Must match your planned slide count exactly
```

If the count is wrong, **stop and fix it** before proceeding.

To **duplicate** a slide you need multiple copies of:
```bash
python $SKILL_SCRIPTS/add_slide.py /tmp/chronoshub-unpacked/ slide54.xml
# Prints a new <p:sldId> element — insert it at the right position in <p:sldIdLst>
```

### 4. Edit content

For each slide: read the XML, find all `<a:t>` text nodes, replace placeholder text with real content. Use the Edit tool — not sed or Python.

**Key rules:**
- Preserve all `<a:rPr>` attributes (size, font, color) — only change `<a:t>` content
- Multiple list items: use separate `<a:p>` elements, never concatenate into one
- Color accent words: `<a:solidFill><a:srgbClr val="06296B"/></a:solidFill>` on `<a:rPr>`
- Smart quotes: `&#x201C;` (") and `&#x201D;` (")

### 5. Pre-pack checks

```bash
# Correct slide count
grep -c '<p:sldId ' /tmp/chronoshub-unpacked/ppt/presentation.xml

# No leftover placeholder text
grep -r "Use this to\|Full Name\|First thing\|First item\|First event\|Slide deck title\|Add a short desc\|Name each item\|Write concise" \
  /tmp/chronoshub-unpacked/ppt/slides/ | grep "<a:t>"
```

Fix anything found before proceeding.

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
- **Don't mix fonts arbitrarily**: Sora for display/headlines, Public Sans for body.
- **Image placeholders**: Replace the file in `/ppt/media/` and update the `.rels` if adding a new image ref — or keep the placeholder and note it to the user.
- **Don't add the logo manually**: It is inherited from slide layouts on content slides.
- **Color discipline**: Emphasize text with Marine (`06296B`) or Violet (`63419F`) only. Never introduce other colors.
- **Delete instruction slides**: Slides 2, 6, 9, 12, 19, 26, 31, 33, 38, 45, 50, 53, 56, 60 are instruction separators. Never include in output.
- **Delete brand reference slides**: Slides 64–70. Never include in output.
