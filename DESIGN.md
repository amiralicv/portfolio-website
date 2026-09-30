---
name: Amirali Abbasi — Portfolio and Learning
description: A black, Spring-green portfolio with a calmer warm-charcoal study room at /learning.
colors:
  home-ground: "oklch(0.04 0 0)"
  home-surface: "oklch(0.11 0.008 155)"
  home-surface-raised: "oklch(0.16 0.01 155)"
  home-ink: "oklch(0.97 0.008 150)"
  home-ink-muted: "oklch(0.7 0.022 150)"
  spring-leaf: "oklch(0.76 0.19 143)"
  spring-leaf-ink: "oklch(0.08 0.01 155)"
  spring-teal: "oklch(0.72 0.14 180)"
  home-hairline: "oklch(0.85 0.15 145 / 14%)"
  learning-ground: "oklch(0.175 0.006 75)"
  learning-surface: "oklch(0.215 0.007 75)"
  learning-surface-raised: "oklch(0.26 0.008 75)"
  learning-ink: "oklch(0.93 0.014 85)"
  learning-ink-muted: "oklch(0.74 0.016 80)"
  sage: "oklch(0.8 0.085 150)"
  sage-ink: "oklch(0.2 0.02 150)"
  amber-in-progress: "oklch(0.82 0.09 78)"
  clay-core: "oklch(0.72 0.1 25)"
  learning-hairline: "oklch(0.93 0.02 85 / 10%)"
  code-ground: "oklch(0.148 0.006 70)"
typography:
  home-display:
    fontFamily: "Space Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(3rem, 8vw, 4.5rem)"
    fontWeight: 600
    lineHeight: 0.95
    letterSpacing: "-0.02em"
  home-headline:
    fontFamily: "Space Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 600
    letterSpacing: "-0.02em"
  home-body:
    fontFamily: "DM Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.625
  home-label:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    letterSpacing: "0.1em"
  learning-display:
    fontFamily: "Literata, ui-serif, Georgia, serif"
    fontSize: "clamp(2.5rem, 6vw, 3rem)"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.012em"
  learning-title:
    fontFamily: "Literata, ui-serif, Georgia, serif"
    fontSize: "1.25rem"
    fontWeight: 600
    letterSpacing: "-0.012em"
  learning-reading:
    fontFamily: "Literata, ui-serif, Georgia, serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.8
    fontFeature: "\"onum\""
  learning-interface:
    fontFamily: "Figtree, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  learning-meta:
    fontFamily: "Figtree, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
    fontFeature: "\"tnum\""
  code:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "0.86rem"
    fontWeight: 400
    lineHeight: 1.7
rounded:
  inline: "0.35rem"
  row: "0.7rem"
  block: "0.9rem"
  base: "0.875rem"
  panel: "1.125rem"
  pill: "999px"
spacing:
  learning-measure: "68ch"
  learning-column: "48rem"
  home-column: "64rem"
  gutter: "20px"
  gutter-wide: "32px"
components:
  home-button-primary:
    backgroundColor: "{colors.spring-leaf}"
    textColor: "{colors.spring-leaf-ink}"
    rounded: "{rounded.pill}"
    padding: "12px 24px"
  home-button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.home-ink}"
    rounded: "{rounded.pill}"
    padding: "12px 24px"
  home-button-ghost-hover:
    backgroundColor: "{colors.home-surface-raised}"
  learning-path-node:
    backgroundColor: "{colors.learning-surface}"
    textColor: "{colors.sage}"
    rounded: "{rounded.pill}"
    size: "36px"
  learning-progress-bar:
    backgroundColor: "{colors.learning-surface-raised}"
    textColor: "{colors.sage}"
    rounded: "{rounded.pill}"
    height: "4px"
  learning-continue-row:
    backgroundColor: "transparent"
    textColor: "{colors.learning-ink}"
    rounded: "{rounded.panel}"
    padding: "12px 16px"
  learning-continue-row-hover:
    backgroundColor: "{colors.learning-surface}"
  learning-priority-core:
    textColor: "{colors.clay-core}"
    rounded: "{rounded.pill}"
    padding: "0.05em 0.5em"
  learning-priority-important:
    backgroundColor: "{colors.learning-surface-raised}"
    textColor: "{colors.learning-ink}"
    rounded: "{rounded.pill}"
    padding: "0.05em 0.5em"
  learning-priority-optional:
    textColor: "{colors.sage}"
    rounded: "{rounded.pill}"
    padding: "0.05em 0.5em"
  learning-checkbox:
    backgroundColor: "transparent"
    rounded: "{rounded.inline}"
    size: "1.1em"
  learning-checkbox-checked:
    backgroundColor: "{colors.sage}"
    textColor: "{colors.sage-ink}"
  learning-code-block:
    backgroundColor: "{colors.code-ground}"
    typography: "{typography.code}"
    rounded: "{rounded.block}"
    padding: "1.15rem 1.3rem"
---

# Design System: Amirali Abbasi — Portfolio and Learning

## Overview

**Creative North Star: "The House and the Study"**

One house, two rooms. The front room (`/`) is the portfolio: a black ground, a single Spring-leaf green, large Space Grotesk headlines, glass panels and slow ambient motion. It is built to be judged quickly by recruiters and engineers. The study (`/learning`) is the same house after dark: warm charcoal instead of black, ivory instead of white, the green softened to sage, and a bookish Literata for reading. It is built to be sat in.

The study is scoped entirely by the `.learning` class, which re-declares the same semantic tokens (`--background`, `--primary`, `--border`, ...) with warmer values. Every Tailwind utility (`bg-card`, `text-primary`) therefore works in both rooms and lands on the right palette without new class names. The family resemblance is structural: same token names, same green hue family (143 to 150), same dark ground, same easing curve.

Density differs by room. The portfolio is wide (64rem column) and theatrical; the study is a single narrow column (48rem, prose at 68ch) with one idea per region, no cards, no grids, and no badge noise.

**Key Characteristics:**
- Dark-only, both rooms; `color-scheme: dark` in the study.
- One accent per room: Spring-leaf on `/`, sage in `/learning`. Amber appears only for "in progress".
- Room identity lives in the `.learning` token override, not in parallel class names.
- Study content is prerendered HTML styled by element (`.note-prose`), so the reading styles are the system.
- Real icons only: simple-icons brand marks for tracks, Lucide line icons for topics and meaningful symbols; emoji never render.
- Shared motion curve `cubic-bezier(0.16, 1, 0.3, 1)`, and every animation has a reduced-motion fallback.

## Colors

Two restrained dark palettes built on the same semantic token names; each room spends colour on one accent.

### Primary
- **Spring Leaf** (spring-leaf): the portfolio's only strong colour. Primary buttons, section numbers, the status pill glow, focus rings (at 60% alpha), link sweeps, the contact frame corners. Also the accent-tinted hairline (home-hairline) is this hue at 14% alpha, so even borders read faintly green.
- **Sage** (sage): the study's accent, the Spring green desaturated and lifted. Links and their underlines (40% alpha at rest), progress-bar fill, the path rail fill, track nodes, checked checkboxes, list markers (60% alpha), selection (30% alpha), "done" counts, the focus outline (55% alpha).

### Secondary
- **Spring Teal** (spring-teal): the portfolio's companion hue, used only as the far stop of the heading gradient and in chart tokens. Never an independent UI accent.
- **Amber In Progress** (amber-in-progress): the study's `--accent`. Reserved for a topic count the reader has started but not finished, and for warning/question callouts. Nothing else.

### Tertiary
- **Clay** (clay-core): a muted red used for the Core priority pill (16% fill, lighter text), the "no" icon, and danger callouts. It is a meaning colour, never decoration.

### Neutral
- **Pure Black Ground** (home-ground): the portfolio page. Surfaces above it stay near-neutral (chroma at or below 0.01) so the page reads as black.
- **Leaf-Tinted Surface** (home-surface) and **Raised Surface** (home-surface-raised): cards, glass panels (surface at 65% with 14px blur), ghost-button hover, the nav's sliding active pill.
- **Cool Ivory Ink** (home-ink) and **Muted Leaf Grey** (home-ink-muted): text and secondary text on `/`.
- **Warm Charcoal** (learning-ground): the study's page and sticky header. Hue 75, very low chroma.
- **Charcoal Surface** (learning-surface): the only hover fill in the study (track rows, continue row, topic rows, neighbours) and the node disc. **Raised Charcoal** (learning-surface-raised): progress track, inline code, Important pill.
- **Ivory** (learning-ink) and **Warm Grey** (learning-ink-muted): text and metadata. Body prose sits at ivory mixed 90% toward the ground, a touch softer than headings.
- **Ivory Hairline** (learning-hairline): every border and divider in the study, ivory at 10% alpha.
- **Code Ground** (code-ground): the Shiki block background, one step darker than the page.

### Named Rules
**The One Accent Per Room Rule.** Each room spends colour on one hue: Spring Leaf on `/`, sage in `/learning`. Other hues exist only to carry meaning (amber = started, clay = core / no / danger).

**The Amber Means Started Rule.** Amber marks the reader's in-progress state and warning callouts. It never decorates, never highlights, never marks the owner.

**The Scope, Don't Fork Rule.** A new study surface re-uses `bg-background`, `text-primary`, `border-border` inside `.learning`; it does not introduce study-specific colour classes. New room palettes are token overrides on a scoping class.

**The Code In The Palette Rule.** Syntax colours are the Shiki `css-variables` theme mapped to warm tokens: keywords and links sage, strings a soft straw, constants a burnt orange, functions a grey-green, comments warm grey. No off-palette editor theme.

## Typography

**Portfolio:** Space Grotesk (display, 500 to 700) / DM Sans (body, 400 to 500) / JetBrains Mono (metadata).
**Study:** Literata (reading and headings, optical sizing, 400 to 600) / Figtree (interface, 400 to 600) / JetBrains Mono (code only).

**Character:** The portfolio pairs a tight geometric grotesk with a friendly sans; it is confident and technical. The study hands headings and prose to a warm book serif and keeps the chrome in a soft humanist sans, so the page reads like a well-set book with a quiet interface around it. Study fonts load only on `/learning`.

### Hierarchy
- **Home Display** (600, 3rem to 4.5rem, 0.95): the hero name only.
- **Home Headline** (600, 1.875rem to 2.25rem, tracking -0.02em): section titles; h1 to h4 default to Space Grotesk site-wide.
- **Home Body** (DM Sans 400, 0.875rem to 1.25rem, relaxed): paragraphs and descriptions, mostly in muted ink.
- **Home Label** (JetBrains Mono, 0.75rem, uppercase, wide tracking): dates and period metadata on experience and education panels.
- **Study Display** (Literata 600, 2.5rem to 3rem index / 2rem to 2.5rem note, 1.1 to 1.15, balanced): page titles.
- **Study Title** (Literata 600, 1.25rem): track names on the path; note h2 at 1.5rem, h3 1.2rem, h4 1.05rem, line-height 1.3.
- **Study Reading** (Literata 400, 1.0625rem, 1.8, max 68ch, old-style numerals, hanging punctuation): note bodies.
- **Study Interface** (Figtree, 0.875rem to 0.9375rem): header, breadcrumbs, intros, tables (0.9rem, 1.55), callout titles.
- **Study Meta** (Figtree, 0.72rem to 0.8rem, tabular numerals): counts, progress labels, priority pills, code captions.
- **Code** (JetBrains Mono, 0.86rem blocks at 1.7, inline 0.84em).

### Named Rules
**The Book And The Frame Rule.** In the study, anything read is Literata; anything operated is Figtree. Tables and callout titles count as interface.

**The Mono Is For Code Rule.** In the study, JetBrains Mono appears only in code. It is not a label or metadata face there.

**The Honest Numbers Rule.** Numbers in running text use old-style figures; counts, tables and code use lining tabular figures. Numbering is plain 1, 2, 3, never zero-padded. Progress reads as "3 of 612 done" or "612 items", never a rounded 0%.

## Layout

**Portfolio:** a centred 64rem column with 20px / 32px gutters, a hero at 88vh min-height over a fixed animated background, then a solid panel joined by an eight-stop fade. Sections breathe at 40px to 56px vertical padding with a title row closed by a hairline that runs to the edge. Panels use 28px to 40px internal padding. Navigation is a fixed centred pill that tightens past the hero.

**Study:** one centred 48rem column, 20px / 32px gutters, 48px / 64px top padding and 112px at the bottom, under a 56px sticky header. The index is a single vertical ordered path, not a grid. Hover rows bleed 16px past the text edge (`-mx-4 px-4`) so the text stays aligned while the hit area grows. Notes open with breadcrumbs, then an icon tile, title, meta line and a thin progress bar, then prose, then a two-column previous/next pair that stacks on mobile. Prose rhythm is 1.15em between blocks, headings pulled close to what follows (0.7em).

**The Single Column Rule.** The study never lays content in card grids or multi-column dashboards. One column, one reading order.

## Elevation & Depth

The portfolio is layered: glass panels (65% surface, 14px blur) lifted by one deep ambient shadow, a green-spilled nav pill, soft blurred radial glows drifting behind content, and a pulsing glow on the status pill. The study is almost flat: depth comes from tonal steps (ground, surface, raised) and ivory hairlines. Its only shadows are the code block's soft drop and the node's ring, which is a halo in the ground colour that "cuts" the rail behind it.

### Shadow Vocabulary
- **Elevated** (`box-shadow: 0 24px 70px -30px oklch(0 0 0 / 80%)`): glass panels on `/`.
- **Nav Pill** (`inset 0 1px 0 rgb(255 255 255 / 7%), 0 10px 30px -14px color-mix(in oklab, var(--primary) 55%, transparent), 0 2px 10px -6px rgb(0 0 0 / 60%)`): the desktop nav only.
- **Code Block** (`inset 0 0 0 1px var(--border), 0 12px 30px -18px oklch(0 0 0 / 60%)`): Shiki blocks in the study.
- **Node Halo** (`0 0 0 1px var(--border), 0 0 0 6px var(--background)`): path nodes; the inner ring turns sage at 55% once started.

**The Quiet Room Rule.** The study adds no glows, no blur, no ambient motion. If a study element needs to stand out, it gets a tonal step or a sage hairline, not a shadow.

## Shapes

Generously soft everywhere, with pills for anything that is a single control or tag. Portfolio base radius is 0.875rem, panels a step larger, buttons and nav fully round. In the study the radius scales with the element: 0.35rem for inline code and checkboxes, 0.7rem for topic rows, 0.9rem for code blocks and callouts, 1.125rem for the continue row and neighbours, larger still for track rows, full pills for progress bars, nodes and priority tags. Borders are 1px hairlines; the checkbox stroke is 1.5px.

## Components

### Buttons (portfolio)
- **Shape:** full pill.
- **Primary:** Spring Leaf fill, dark leaf ink, 12px 24px, 0.875rem medium; hover scales to 1.05.
- **Ghost:** hairline border, ivory text, same size; hover fills with the raised surface.
- **Focus:** 2px ring in Spring Leaf at 60%.

### Navigation
- **Portfolio:** fixed centred glass pill (70% ground, heavy blur) with a hairline sheen on top. The active tab is one raised pill that slides between links on a 500ms curve. Learning sits after a hairline divider, in Spring Leaf. Mobile gets a full-screen blurred sheet with large rows fading up in a 35ms stagger.
- **Study:** a plain 56px sticky bar on the ground colour with a hairline bottom: back-arrow name on the left (muted, arrow nudges left on hover), "Learning" on the right (hover to sage). Breadcrumbs are muted Figtree links separated by small chevrons.

### Learning Path (signature)
The index's ordered list of five tracks. Each step has a 36px round node holding the track's brand mark in sage, and a full-width hover row with a Literata title, a muted intro (58ch), a 4px progress bar (max 14rem) and a tabular count. A 1px hairline rail joins the nodes; a sage copy of it scales in from the top (700ms) up to the furthest track the reader has started. The arrow appears only on hover or focus.

### Progress Bar
4px, pill, raised-charcoal track, sage fill that animates width over 500ms. Always the reader's own progress, labelled for assistive tech.

### Continue Row
Shown only when the reader has history. Hairline-bordered row: muted "Continue where you left off" over the note title, sage arrow. Hover fills with the charcoal surface and warms the border to sage at 40%.

### Checklist Item
A custom 1.1em box with a 1.5px ivory-at-30% stroke; hover turns the stroke sage; checked fills sage with a dark drawn check, and the item's text drops to warm grey. Ticks persist per browser only.

### Priority Pill
Tiny Figtree pill (0.72rem) labelled Core / Important / Optional: Core is clay, Important a raised neutral, Optional sage. Its key is always labelled "Priority". Inside tables, the same vault circles become plain tier numbers 1 / 2 / 3.

### Topic List
Section overviews list topics as full-width rows (0.7rem radius, hover to surface) with the title and a live count: warm grey untouched, amber started, sage complete.

### Callout
A soft tinted panel: the tone colour at 8% over the surface with an 18% inset hairline, no side stripe. Tone is sage for tips, amber for warnings and questions, clay for danger, warm grey otherwise. Collapsible callouts use a drawn chevron that rotates on open.

### Code Block
Code-ground panel, 0.9rem radius, hairline inset plus soft drop shadow, the language as a small warm-grey caption top right. Inline code is a raised-charcoal chip.

### Icons
Tracks use simple-icons brand paths with a 0.9 hairline stroke to even out optical weight. Topics use Lucide line icons at 1.75 stroke, mapped from the vault's emoji; meaningful symbols (yes, no, warning, star) are drawn inline SVGs. Everything else pictographic is stripped.

## Do's and Don'ts

### Do:
- **Do** build any new study surface inside `.learning` and use the semantic utilities (`bg-card`, `text-primary`, `border-border`); the room's palette arrives through the token override.
- **Do** set reading in Literata at 1.0625rem / 1.8 with a 68ch measure, and interface in Figtree.
- **Do** keep hover feedback in the study to a surface fill, a sage hairline, or a 2px arrow nudge, on 180ms to 200ms ease-out.
- **Do** show progress as the visitor's own counts ("3 of 612 done"), in tabular figures.
- **Do** use `cubic-bezier(0.16, 1, 0.3, 1)` for entrances and fills, and give every animation a reduced-motion fallback.
- **Do** mark tracks with brand logos and topics with Lucide line icons.

### Don't:
- **Don't** render emoji anywhere on the site; map meaningful ones to drawn icons and drop the rest.
- **Don't** use card grids, neon glows, blur, or badge clusters in `/learning`.
- **Don't** use amber for anything but "in progress" and warning callouts.
- **Don't** publish or display the owner's own ticks or vault status; only the visitor's per-browser progress appears.
- **Don't** zero-pad numbers (1, 2, 3, not 01, 02, 03).
- **Don't** use JetBrains Mono for labels inside `/learning`; it is for code.
- **Don't** add a coloured side stripe to callouts; tone is carried by the tinted fill and hairline.
