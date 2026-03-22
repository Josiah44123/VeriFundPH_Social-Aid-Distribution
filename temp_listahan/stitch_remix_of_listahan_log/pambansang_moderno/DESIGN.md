# Design System Documentation: Digital Sovereignty

## 1. Overview & Creative North Star: "The Modern Vanguard"
This design system rejects the "bureaucratic beige" of traditional government software. Our Creative North Star is **The Modern Vanguard**—an editorial-inspired framework that treats government service as a premium, high-trust experience. 

Instead of rigid, boxed-in layouts, we utilize **intentional asymmetry** and **tonal layering** to guide the eye. We break the "template" look by using "Primary-Fixed" accents as anchor points and allowing "Surface-Bright" areas to breathe. The goal is to make a field worker feel empowered by a tool that is as sharp and professional as their mission.

---

## 2. Colors: The National Vibrancy
We use the Philippine tri-color not as mere decoration, but as functional signifiers.

### The "No-Line" Rule
**Strict Mandate:** Designers are prohibited from using 1px solid borders to section off content. Boundaries must be defined through background color shifts.
*   **The Transition:** Use `surface-container-low` (#f1f4f9) for the main body and `surface-container-lowest` (#ffffff) for card-level interaction. The contrast is felt, not seen.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers:
*   **Base Layer:** `background` (#f7f9fe) — The vast, clean canvas.
*   **Section Layer:** `surface-container` (#eceef3) — Used for grouping related modules.
*   **Action Layer:** `surface-container-lowest` (#ffffff) — Reserved for the "active" paper where the user inputs data.

### Signature Textures & Glass
*   **The "Vinta" Gradient:** For high-impact CTAs, use a linear gradient from `primary` (#002576) to `primary_container` (#0038a8). It adds a "soul" and depth that flat hex codes cannot replicate.
*   **Glassmorphism:** Use `surface-variant` with a 70% opacity and a `20px backdrop-blur` for floating navigation bars. This allows the vibrant `secondary` and `tertiary` accents of the page to bleed through, maintaining a sense of place.

---

## 3. Typography: Authority in Motion
We utilize **Plus Jakarta Sans** for its geometric clarity and modern "authoritative" stance.

*   **Display (lg/md/sm):** Used for large data visualizations or "hero" welcome states. Set with `-0.02em` letter spacing to feel "locked in" and tight.
*   **Headline (lg/md):** Your primary navigational anchors. Use `on-surface` (#181c20) to maintain high-contrast accessibility.
*   **Title (md/sm):** Reserved for card headers. These should always be **Bold** to project security and certainty.
*   **Body (lg/md):** Optimized for field legibility. Use `body-lg` for all input-field text to ensure readability under direct sunlight.

---

## 4. Elevation & Depth: Tonal Layering
We do not use shadows to create "pop"; we use them to create "presence."

*   **The Layering Principle:** Place a `surface-container-lowest` card on top of a `surface-container-low` section. The `0.125rem` (2) difference in tone is sufficient to signal a change in context.
*   **Ambient Shadows:** For floating action buttons or critical modals, use a custom shadow: `0 8px 32px rgba(0, 56, 168, 0.06)`. Note the tint—we use a 6% opacity of our `primary_container` blue, never pure black, to keep the light mode feeling "airy."
*   **The Ghost Border Fallback:** If a border is required for accessibility (e.g., high-glare environments), use `outline-variant` (#c4c5d5) at **15% opacity**. It should be a whisper, not a shout.

---

## 5. Components: The Primitive Set

### Buttons: The Weighted Action
*   **Primary:** Uses the "Vinta" Gradient. `rounded-md` (0.375rem). No border.
*   **Secondary:** `surface-container-high` background with `on-primary-fixed-variant` text.
*   **Tertiary:** Pure text using `primary` color, but with a `primary-fixed` (0.25rem) rounded background on hover.

### Input Fields: The Editorial Form
*   **Style:** No bottom line or full box. Use a `surface-container-lowest` fill with a `surface-dim` bottom indicator (2px). 
*   **Focus State:** The bottom indicator transitions to `primary` (#002576) and the background shifts to a very pale version of `primary-fixed`.

### Cards & Lists: The "No-Divider" Rule
*   **Lists:** Forbid the use of horizontal rules (`<hr>`). Separate list items using the `3` (0.75rem) spacing scale. 
*   **Selection:** Use a `tertiary-fixed` (#ffe17b) left-accent bar (4px width) to indicate a selected list item. It draws on the Philippine Gold to signify importance.

### Specialized Field Components
*   **The "Verified" Badge:** A `secondary_container` (#e12531) pill with `on-secondary-container` text. It uses the Philippine Red to denote official, stamped approval.
*   **Data Pill:** Small chips using `tertiary_container` to highlight key field metrics (e.g., "Active," "Pending").

---

## 6. Do's and Don'ts

### Do
*   **Do** use `20` (5rem) and `24` (6rem) spacing for top-level section margins to create an "Editorial" feel.
*   **Do** use `Plus Jakarta Sans` Bold for all labels; the "Pambansang" theme requires a heavy, confident typographic voice.
*   **Do** embrace white space. If a screen feels "empty," increase the type size of the headline rather than adding more containers.

### Don't
*   **Don't** use `#000000` for text. Always use `on-surface` (#181c20).
*   **Don't** use "Drop Shadows" from standard UI kits. Only use the Ambient Shadow formula provided in Section 4.
*   **Don't** use standard 1px dividers. If you need to separate content, use a background color shift to `surface-container-highest`.