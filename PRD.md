# Astro Icons — Product Requirements Document (PRD)

## 1. Project Goal

Build a small, clean, standalone npm package for Indian/Vedic astrology SVG icons.

The first icon family is **Rāśi** (12 zodiac signs).

The package must expose the icons through simple Web Components:

```html
<astro-rashi icon="mesha"></astro-rashi>
```

The package will eventually support additional astrology icon families such as Graha, Nakshatra, etc.

Example future API:

```html
<astro-graha icon="surya"></astro-graha>
```

This repository must remain independent from the main Astro astrology application.

---

## 2. Important Architecture Principle

This repository is an **icon library**, not an astrology calculation library.

It must NOT contain:

* horoscope calculations
* planetary calculations
* birth-chart logic
* ephemeris calculations
* zodiac interpretation
* user/account logic
* database code
* application-specific UI
* Astro application pages
* application business logic

It only provides:

1. SVG artwork
2. Web Components for rendering the artwork
3. a small JavaScript API
4. package metadata/documentation

---

## 3. Distribution Model

The package will be published to the public npm registry.

The repository itself does NOT need to be deployed as a website.

Development flow:

```text
astro-icons repository
        ↓
npm run build
        ↓
dist/
        ↓
npm publish
        ↓
npm registry
```

The main Astro application consumes it with:

```bash
npm install @arivedha/astro-icons
```

The exact npm package name/scope should be configurable and decided before publishing.

Do not publish anything automatically.

---

## 4. Current Icon Family

The first family is Rāśi.

There are exactly 12 initial icons:

| Rāśi      | Icon name   | SVG             |
| --------- | ----------- | --------------- |
| Mesha     | `mesha`     | `mesha.svg`     |
| Rishabha  | `rishabha`  | `rishabha.svg`  |
| Mithuna   | `mithuna`   | `mithuna.svg`   |
| Kataka    | `kataka`    | `kataka.svg`    |
| Simha     | `simha`     | `simha.svg`     |
| Kanya     | `kanya`     | `kanya.svg`     |
| Thula     | `thula`     | `thula.svg`     |
| Vrischika | `vrischika` | `vrischika.svg` |
| Dhanus    | `dhanus`    | `dhanus.svg`    |
| Makara    | `makara`    | `makara.svg`    |
| Kumbha    | `kumbha`    | `kumbha.svg`    |
| Meena     | `meena`     | `meena.svg`     |

The user has created the SVG artwork.

**Do not modify, regenerate, redraw, simplify, or replace the canonical SVG artwork.**

Treat the SVG files as canonical assets.

---

## 5. SVG Requirements

All Rāśi SVG files should:

* remain standalone SVG files
* use a consistent `viewBox` (`0 0 1024 1024` or `0 0 64 64`)
* use `currentColor` where foreground coloring is intended
* contain no hard-coded application colors unless the artwork specifically requires them
* contain no external font dependencies
* contain no external image dependencies
* contain no raster images
* contain no JavaScript
* contain no HTML
* contain no application-specific metadata

The SVGs should remain usable independently from the Web Component.

Do NOT alter artwork merely for optimization unless explicitly requested.

---

## 6. Public Web Component API

The primary public API is:

```html
<astro-rashi icon="mesha"></astro-rashi>
```

Supported attributes:

```text
icon
size
color
bg
radius
```

Examples:

```html
<astro-rashi icon="mesha"></astro-rashi>

<astro-rashi icon="mesha" size="48"></astro-rashi>

<astro-rashi
  icon="mesha"
  size="64"
  color="#8B4513">
</astro-rashi>

<astro-rashi
  icon="mesha"
  size="64"
  color="#8B4513"
  bg="#FFF8E7"
  radius="12">
</astro-rashi>
```

---

## 7. Attribute Semantics

### `icon`
* **Required**.
* Valid values are the 12 Rāśi names.
* Unknown icon names fail gracefully (render empty, emit console warning, no uncaught exceptions).

### `size`
* **Optional**. Default: `24`.
* Represents width and height in pixels. Icon remains square.

### `color`
* **Optional**. Default: `currentColor`.
* Inherits from parent text color via `currentColor` or uses specified CSS color.

### `bg`
* **Optional**. Default: `transparent`.
* Supports `"none"` and `"transparent"` for alpha transparency, or any valid CSS background color.

### `radius`
* **Optional**. Default: `0`.
* Supports pixel values (`4`, `8`, `12`, `16`), percentages (`50%`), and `"circle"`.

---

## 8. Web Component Requirements

* Use standard browser Web Components / Custom Elements (`customElements.define("astro-rashi", AstroRashi)`).
* The tag name is `astro-rashi` (must contain a hyphen).
* Component registration is safe guarded (`if (!customElements.get("astro-rashi"))`).

---

## 9. Rendering

* Inline SVG rendering with no external network requests at runtime.
* SVG scales to the requested size and inherits `currentColor`.
* `aria-hidden="true"` applied to SVG for accessibility.

---

## 10. Runtime Requirements

Zero runtime dependencies (`dependencies: {}`). Consuming applications only need:

```js
import "@arivedha/astro-icons";
```

and then use `<astro-rashi icon="mesha"></astro-rashi>` in HTML, JSX, or Astro.

---

## 11. JavaScript API

```js
export const rashiIcons = Object.freeze([
  "mesha",
  "rishabha",
  "mithuna",
  "kataka",
  "simha",
  "kanya",
  "thula",
  "vrischika",
  "dhanus",
  "makara",
  "kumbha",
  "meena"
]);

export class AstroRashi extends HTMLElement { ... }
```

---

## 12. Future Extensibility

Structure is architected for future expansion (`graha/`, `nakshatra/`) without breaking changes to `rashi/`.

---

## 13. Package & Build Architecture

* **Build Tool**: Vite library mode targeting ES format (`dist/index.js`).
* **Bundle Output**: Self-contained `dist/index.js` containing all inline SVGs and Web Component registration.
* **Zero Runtime Dependencies**: 0 dependencies in `dependencies`.

---

## 14. Package Verification

1. `npm run build` generates clean `dist/index.js`.
2. `npm pack` creates `.tgz` archive.
3. Independent project installation verification.
4. Astro framework integration verification.
