---
name: juicebox-design
description: Authoritative token-driven Design System skill specifying Juicebox (PeopleGPT) visual layout primitives, border framing, hatched patterns, geometric grids, and high-contrast light/purple typography for dApps and web applications.
---

# Juicebox (PeopleGPT) Design System Specification

## 1. Overview & Core Philosophy
The Juicebox (PeopleGPT) Design System is a crisp, content-first, tokenized UI framework. It combines a clean, light off-white page canvas (`#f8f6f8`) with bounded structural seam lines (`#e7e4e7`), monospaced category pills, high-contrast typography (`#1d161d`), and signature deep purple geometric hero canvases (`#6a2f8d`).

## 2. Design Tokens

### Color Palette
- **Canvas Background**: `#f8f6f8` (Light warm off-white)
- **Container / Card Background**: `#ffffff` (Pure white)
- **Hero Canvas Accent**: `#6a2f8d` (Juicebox signature deep purple)
- **Hero Canvas Dark**: `#3a1a4d` (Hover / dark accent purple)
- **Pill Background**: `#f1e6f8` (Light purple mono background)
- **Primary Text**: `#1d161d` (High-contrast charcoal)
- **Secondary Text**: `#574e57` (Muted dark gray)
- **Muted Text / Placeholder**: `#786c78` (Subtle gray)
- **Border Subtle**: `#e7e4e7` (1px solid light gray grid line)
- **Border Dashed**: `#786c78` (1px dashed structural grid seam)
- **Status Green (Pass / Match)**: `#10b981` (Vibrant green indicator)
- **Status Cyan (Rail / Network)**: `#2f878d` (Cleanverse cyan)
- **Status Amber (Risk / Warning)**: `#f59e0b` (Alert yellow/amber)
- **Status Rose (Suspend / Error)**: `#f43f5e` (Rose red)

### Typography & Fonts
- **Primary Sans Font**: `'Inter', -apple-system, BlinkMacSystemFont, sans-serif`
- **Monospaced Font**: `'DM Mono', 'JetBrains Mono', monospace`
- **Font Scale**:
  - `xs`: `10px` / `12px` (Labels, badges, audit hashes)
  - `sm`: `12px` / `14px` (Body text, table rows, button text)
  - `base`: `14px` / `16px` (Card subtitles, descriptions)
  - `lg`: `18px` / `20px` (Section titles, card headers)
  - `xl`: `24px` / `28px` (Hero subheadings)
  - `2xl`: `32px` / `36px` (Page titles)

### Spacing Scale
- `1` = `4px`
- `2` = `8px`
- `3` = `12px`
- `4` = `16px`
- `5` = `24px`
- `6` = `32px`
- `8` = `48px`

### Radius & Border Tokens
- `radius.xs` = `3px`
- `radius.sm` = `4px`
- `radius.md` = `6px`
- `radius.lg` = `8px`
- `border.grid` = `1px solid #e7e4e7`
- `border.hatched` = `1px solid #e7e4e7` with diagonal stripe fill

---

## 3. Layout Primitives & Structural Seams

### Outer Bounded Container (`.jb-framed-container`)
Every page is contained within a centered 1280px grid with explicit left and right border seams:
```css
.jb-framed-container {
  max-width: 1280px;
  margin-left: auto;
  margin-right: auto;
  border-left: 1px solid #e7e4e7;
  border-right: 1px solid #e7e4e7;
  background-color: #ffffff;
  min-height: 100vh;
}
```

### Hatched Diagonal Seam Pattern (`.jb-hatched-pattern`)
Used to fill empty structural gaps in sub-nav bars and header dividers:
```css
.jb-hatched-pattern {
  background-image: repeating-linear-gradient(
    -45deg,
    transparent,
    transparent 5px,
    rgba(120, 108, 120, 0.12) 5px,
    rgba(120, 108, 120, 0.12) 10px
  );
}
```

### Deep Purple Hero Canvas Grid (`.jb-purple-canvas`)
A high-impact hero container featuring a 32px wireframe grid:
```css
.jb-purple-canvas {
  background-color: #6a2f8d;
  background-image: 
    linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px);
  background-size: 32px 32px;
}
```

---

## 4. Component Design Specifications

### Category Mono Pill (`.jb-category-pill`)
```html
<span class="font-mono text-[11px] font-medium tracking-wider uppercase px-2.5 py-1 rounded-[3px] bg-[#f1e6f8] text-[#6a2f8d]">
  CATEGORY TAG
</span>
```

### Action Buttons
1. **Primary Solid Button (`.jb-btn-dark`)**:
   ```css
   background-color: #1d161d;
   color: #ffffff;
   font-weight: 700;
   font-size: 11px;
   letter-spacing: 0.06em;
   text-transform: uppercase;
   padding: 10px 18px;
   border-radius: 4px;
   ```
2. **Secondary Outline Button (`.jb-btn-light`)**:
   ```css
   background-color: #ffffff;
   color: #1d161d;
   font-weight: 700;
   font-size: 11px;
   letter-spacing: 0.06em;
   text-transform: uppercase;
   padding: 10px 18px;
   border-radius: 4px;
   border: 1px solid #e7e4e7;
   ```

### Status Badges
- **Pass / Verified**: `bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-[10px] px-2 py-0.5 rounded`
- **Active / Assigned**: `bg-[#f1e6f8] text-[#6a2f8d] border border-[#6a2f8d]/30 font-bold text-[10px] px-2 py-0.5 rounded`
- **At Risk / Warning**: `bg-amber-100 text-amber-800 border border-amber-200 font-bold text-[10px] px-2 py-0.5 rounded`
- **Frozen / Suspended**: `bg-rose-100 text-rose-800 border border-rose-200 font-bold text-[10px] px-2 py-0.5 rounded`

---

## 5. Accessibility & Implementation Guidelines
- **WCAG 2.2 AA Compliance**: All text elements on white (`#ffffff`), light off-white (`#f8f6f8`), and purple (`#6a2f8d`) backgrounds MUST maintain a contrast ratio $\ge 4.5:1$.
- **Keyboard Navigation**: Focus indicators MUST use `:focus-visible` with `outline: 2px solid #6a2f8d; outline-offset: 2px;`.
- **Domain Independence**: Never hardcode third-party marketing text inside the design system definition. The design system is a pure visual framework.
