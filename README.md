# @arivedha/astro-icons

[![npm version](https://img.shields.io/npm/v/@arivedha/astro-icons.svg?color=blue)](https://www.npmjs.com/package/@arivedha/astro-icons)
[![CI](https://github.com/Sudhakar77777/astro-icons/actions/workflows/ci.yml/badge.svg)](https://github.com/Sudhakar77777/astro-icons/actions/workflows/ci.yml)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live%20Workbench-success.svg)](https://sudhakar77777.github.io/astro-icons/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Dependencies](https://img.shields.io/badge/dependencies-0-success.svg)](#)
[![Bundle Size](https://img.shields.io/badge/bundle-zero--runtime--deps-emerald.svg)](#)

A gold-standard vector SVG iconography package for **Indian & Vedic Astrology** (12 Rāśi / Zodiac Signs).

Engineered for temple-grade authenticity and publication-level media aesthetics (inspired by traditional Tamil Rasipalan & Dinamalar gold medallions). Built as a lightweight, **zero-runtime-dependency** Web Component library with first-class support for **Vanilla HTML**, **Astro**, **React**, **Next.js**, **Vue**, and **Svelte**.

---

## 🌐 Live Interactive Playground & Studio

Experience and configure all 12 Vedic Rāśi icons first-hand in our live browser studio:

👉 **[https://sudhakar77777.github.io/astro-icons/](https://sudhakar77777.github.io/astro-icons/)**

- **⚡ Dual-Pane Live Customizer**: Test color pickers, background colors, circular vs square borders, lighting bevels, and glow effects side-by-side with live HTML code generation.
- **🔍 6-Tier Optical Sizing Matrix**: Inspect all 12 signs across $128\text{px}$, $96\text{px}$, $64\text{px}$, $48\text{px}$, $36\text{px}$, and $24\text{px}$.
- **🏆 1-Click Stamped 3D Presets**: Test Gold Medallions, Tactical Buttons, Inset Carved, Sacred Glow, and Frosted Glassmorphism.
- **🎨 Canvas Themes**: Switch live preview backgrounds between Dark Nebula, Light Slate, Vintage Parchment, and Checkerboard Alpha.

---

## ✨ Features

- **🏛 Authentic Temple-Grade Iconography**: Gold-standard traditional Vedic artwork without cartoonish faces or exaggerated expressions.
- **⚡ Zero Runtime Dependencies**: Pure, vanilla Web Component architecture (`<astro-rashi>`) that runs natively in every modern browser (`dependencies: {}`).
- **🎨 100% `currentColor` Theming**: Vector paths inherit text color automatically, or can be customized to any hex/RGB color.
- **🔍 Dual Optical Sizing**:
  - **`detailed` ($\ge 48\text{px}$)**: High-resolution temple engraving with fine details and rich textures.
  - **`compact` ($< 48\text{px}$)**: Cleaned micro-cuts with hairline noise filtered out for sharp $24\text{px}$ and $36\text{px}$ legibility.
  - **`auto`**: Seamlessly switches between detailed and compact variants based on the `size` attribute.
- **🛡 Circular Safe-Zone Guaranteed**: All 12 icons are calibrated inside circular safe zones so they **never collide with or intersect the rim** when `radius="50%"`.
- **🏆 3D Stamped Medallion & Lighting**: Built-in 3D Gold Medallion, Raised Tactical Button, Glassmorphism, Inset Carved, and Sacred Glow presets.
- **🏁 100% Transparent Background Support**: Setting `bg="none"` or `bg="transparent"` yields true alpha transparency with zero background boxes, zero padding, and zero circular smudges.
- **⚛️ Universal Framework Support**: Works natively across HTML, Astro, React 19+, Next.js, Vite, Vue, and Svelte.

---

## 📦 Installation

```bash
npm install @arivedha/astro-icons
```

Or clone the repository directly:

```bash
git clone https://github.com/Sudhakar77777/astro-icons.git
```

---

## 🚀 Quick Start Guide

### 1. Plain HTML / Vanilla JS

Import the component once in your application entry or HTML `<head>`:

```html
<script type="module" src="node_modules/@arivedha/astro-icons/dist/index.js"></script>

<!-- 1. Pure Flat Vector on Transparent Background (No Rim, No Background) -->
<astro-rashi icon="simha" size="48" color="#facc15" bg="none" ring="none"></astro-rashi>

<!-- 2. Small 24px Navigation Bar Icon (Auto-switches to Clean Micro-Cut) -->
<astro-rashi icon="mesha" size="24" color="#38bdf8" bg="none" ring="none"></astro-rashi>

<!-- 3. Authentic 3D Gold Medallion on Crimson Background -->
<astro-rashi icon="kanya" size="64" color="#facc15" bg="#781d1d" ring="#facc15" effect="medallion" radius="50%"></astro-rashi>

<!-- 4. Tactical 3D Raised Button -->
<astro-rashi icon="makara" size="56" color="#ffffff" bg="#111827" ring="#38bdf8" effect="button" radius="12"></astro-rashi>
```

---

### 2. Astro Framework (`.astro`)

Import `@arivedha/astro-icons` in your Astro component frontmatter:

```astro
---
import "@arivedha/astro-icons";
---

<div class="zodiac-grid">
  <!-- Flat Vector -->
  <astro-rashi icon="mesha" size="48" color="#7C2D12" />

  <!-- 3D Gold Medallion -->
  <astro-rashi icon="simha" size="64" color="#facc15" bg="#781d1d" ring="#facc15" effect="medallion" radius="50%" />

  <!-- Tactical Button -->
  <astro-rashi icon="kanya" size="48" color="#10b981" bg="#022c22" ring="#059669" effect="button" radius="10" />
</div>
```

---

### 3. React / Next.js (`.jsx` / `.tsx`)

Import the library once (in your root layout or component), then use standard `<astro-rashi>` elements:

```tsx
import "@arivedha/astro-icons";

export function HoroscopeCard() {
  return (
    <div className="card">
      {/* Flat Transparent Icon */}
      <astro-rashi 
        icon="simha" 
        size="36" 
        color="#facc15" 
        bg="none" 
        ring="none" 
      />

      {/* 3D Gold Medallion */}
      <astro-rashi 
        icon="kanya" 
        size="64" 
        color="#facc15" 
        bg="#781d1d" 
        ring="#facc15" 
        effect="medallion" 
        radius="50%" 
      />
    </div>
  );
}
```

> **Note for TypeScript in React**: You can declare the custom element in your `global.d.ts`:
> ```ts
> declare namespace JSX {
>   interface IntrinsicElements {
>     'astro-rashi': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
>       icon: string;
>       size?: number | string;
>       color?: string;
>       bg?: string;
>       ring?: string;
>       effect?: string;
>       radius?: string;
>       variant?: string;
>       padding?: string;
>     };
>   }
> }
> ```

---

### 4. Direct Raw SVG Imports

All 12 icons are available as standalone SVGs in both Detailed and Clean Compact variants:

- **Detailed SVGs**: `@arivedha/astro-icons/rashi/[icon].svg`
- **Clean Compact SVGs**: `@arivedha/astro-icons/rashi/compact/[icon].svg`

```jsx
import SimhaSvg from '@arivedha/astro-icons/rashi/simha.svg';

<img src={SimhaSvg} width="64" height="64" alt="Simha Rāśi" />
```

---

## 📜 12 Rāśi ID Reference

| ID | Sanskrit Name | Tamil Name (தமிழ்) | English / Western Symbol | Ruling Planet | Element |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `mesha` | Meṣa | மேஷம் | Ram (Aries) | Mars (செவ்வாய்) | Fire |
| `rishabha` | Vṛṣabha | ரிஷபம் | Bull (Taurus) | Venus (சுக்கிரன்) | Earth |
| `mithuna` | Mithuna | மிதுனம் | Twins (Gemini) | Mercury (புதன்) | Air |
| `kataka` | Karkaṭa | கடகம் | Crab (Cancer) | Moon (சந்திரன்) | Water |
| `simha` | Siṃha | சிம்மம் | Lion (Leo) | Sun (சூரியன்) | Fire |
| `kanya` | Kanyā | கன்னி | Maiden (Virgo) | Mercury (புதன்) | Earth |
| `thula` | Tulā | துலாம் | Balance Scales (Libra) | Venus (சுக்கிரன்) | Air |
| `vrischika` | Vṛścika | விருச்சிகம் | Scorpion (Scorpio) | Mars (செவ்வாய்) | Water |
| `dhanus` | Dhanus | தனுசு | Bow & Arrow (Sagittarius) | Jupiter (குரு) | Fire |
| `makara` | Makara | மகரம் | Makara Sea-Beast (Capricorn) | Saturn (சனி) | Earth |
| `kumbha` | Kumbha | கும்பம் | Kalasha Water Pot (Aquarius) | Saturn (சனி) | Air |
| `meena` | Mīna | மீனம் | Twin Fish (Pisces) | Jupiter (குரு) | Water |

---

## ⚙️ Attributes Reference

| Attribute | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `icon` | `string` | **(Required)** | One of the 12 Rāśi IDs (e.g. `simha`, `kanya`, `mesha`) |
| `size` | `number \| string` | `24` | Width & height in pixels (e.g. `24`, `36`, `48`, `64`, `128`) |
| `color` | `string` | `"currentColor"` | Foreground color of the icon path (e.g. `#facc15`, `white`) |
| `bg` | `string` | `"transparent"` | Background color. Use `"none"` or `"transparent"` for alpha transparency. |
| `ring` | `string` | `"none"` | Outer border/rim contrast color. Use `"none"` to remove the border completely. |
| `effect` | `string` | `"none"` | 3D lighting effect: `"none"`, `"medallion"`, `"button"`, `"glass"`, `"emboss"`, `"glow"` |
| `radius` | `string` | `"0"` | Border radius: `"50%"`, `"circle"`, `"16"`, `"8"`, `"0"` |
| `variant` | `string` | `"auto"` | Optical cut: `"auto"` ($<48\text{px}$ compact, $\ge 48\text{px}$ detailed), `"compact"`, `"detailed"` |
| `padding` | `string` | `auto` | Inner padding. Defaults to `0px` when background is transparent. |
| `border` | `string` | `auto` | Custom CSS border override (e.g. `2px dashed gold`) |

---

## 🎨 Visual Effects & Presets

### 1. Pure Flat Vector (`effect="none"`)
Renders crisp vector contours that inherit parent typography color via `currentColor`.
```html
<astro-rashi icon="simha" size="36" color="#facc15" bg="none" ring="none"></astro-rashi>
```

### 2. 3D Gold Medallion (`effect="medallion"`)
Simulates authentic stamped temple medallions with outer rim bevel, drop-shadow, and light highlights.
```html
<astro-rashi icon="simha" size="64" color="#facc15" bg="#781d1d" ring="#facc15" effect="medallion" radius="50%"></astro-rashi>
```

### 3. Tactical 3D Button (`effect="button"`)
Modern tactile button styling with top bevel highlight and bottom shadow.
```html
<astro-rashi icon="makara" size="48" color="#ffffff" bg="#1e293b" ring="#38bdf8" effect="button" radius="10"></astro-rashi>
```

### 4. Glassmorphism (`effect="glass"`)
Frosted glass translucent container with `backdrop-filter: blur(12px)`.
```html
<astro-rashi icon="kanya" size="56" color="#38bdf8" bg="rgba(255,255,255,0.08)" ring="rgba(255,255,255,0.2)" effect="glass" radius="16"></astro-rashi>
```

---

## 💻 JavaScript API

The package exposes the canonical icon list, detailed/compact maps, and the custom element class:

```js
import { AstroRashi, rashiIcons, detailedIcons, compactIcons } from "@arivedha/astro-icons";

console.log(rashiIcons);
// ["mesha", "rishabha", "mithuna", "kataka", "simha", "kanya", "thula", "vrischika", "dhanus", "makara", "kumbha", "meena"]
```

---

## 💻 CSS Variables Styling

You can style `<astro-rashi>` components dynamically using CSS Custom Properties:

```css
.my-custom-rashi {
  --rashi-color: #facc15;
  --rashi-bg: #781d1d;
  --rashi-ring: #facc15;
  --rashi-radius: 50%;
  --rashi-effect: medallion;
}
```

```html
<astro-rashi icon="simha" size="64" class="my-custom-rashi"></astro-rashi>
```

---

## 🧪 Interactive Studio Workbench

You can preview and interact with the workbench either online or locally:

- **🌐 Live Hosted Studio**: [https://sudhakar77777.github.io/astro-icons/](https://sudhakar77777.github.io/astro-icons/)
- **💻 Run Locally**:
  ```bash
  npm install
  npm run dev
  ```
  Open `http://localhost:5173` in your browser.
- **🏗 Build Workbench for Static Hosting**:
  ```bash
  npm run build:demo
  ```

---

## 📄 License

MIT License © 2026 [Arivedha](https://arivedha.us) / [Sudhakar Balakrishnan](https://github.com/Sudhakar77777). Free for personal and commercial astrology applications, horoscopes, panchangam software, and web portals.
