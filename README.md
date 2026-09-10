# @astro/icons — 12 Vedic Rāśi Icon System

A gold-standard vector SVG iconography system for Indian Vedic Astrology (12 Rāśi), designed for temple-grade authenticity and publication-level media aesthetics (inspired by Tamil Rasipalan & Dinamalar gold medallions).

Built with **100% `currentColor` scalable vector paths**, **automatic optical sizing** (Detailed for large displays, Clean Micro-Cuts for small UI buttons), **3D medallion & glassmorphism effects**, and **100% transparent background support**.

---

## ✨ Features

- **🏛 Temple-Grade Authenticity**: True Vedic iconography without cartoonish faces or exaggerated eyes.
- **🎨 100% Monochromatic `currentColor`**: Automatically inherits text colors or custom hex/RGB colors.
- **⚡ Dual Optical Sizing Architecture**:
  - **`detailed` ($\ge 48\text{px}$)**: High-resolution temple engraving with fine lines and delicate textures.
  - **`compact` ($< 48\text{px}$)**: Cleaned micro-cuts with hairline noise filtered out for crisp 24px/36px legibility.
  - **`auto`**: Seamlessly switches variants based on the `size` attribute.
- **🛡 Circular Safe-Zone Guaranteed**: All 12 icons are calibrated inside 740–780px circular safe zones so they **never collide with or intersect the rim** when `radius="50%"`.
- **✨ 3D Medallion & Lighting Effects**: Includes 3D Gold Medallion, Raised Tactical Button, Glassmorphism, Inset Carved, and Sacred Glow.
- **🌐 Universal Framework Support**: Native Web Component (`<astro-rashi>`), first-class React wrapper (`<Rashi />`), and raw SVG files.

---

## 📦 Installation

```bash
npm install @astro/icons
```

Or clone/copy the repository directly into your project:

```bash
git clone https://github.com/your-org/astro-icons.git
```

---

## 🚀 Quick Start Guide

### 1. Plain HTML / Vanilla JS (Web Component)

Import the component script once in your HTML `<head>` or module bundle:

```html
<!-- Import via ES Module -->
<script type="module" src="node_modules/@astro/icons/src/components/rashi.js"></script>

<!-- 1. Pure Flat Vector on Transparent Background (Zero Rim, Zero Dark Box) -->
<astro-rashi icon="simha" size="48" color="#facc15" bg="none" ring="none"></astro-rashi>

<!-- 2. Small 24px Navigation Icon (Automatically uses Clean Micro-Cut) -->
<astro-rashi icon="mesha" size="24" color="#38bdf8" bg="none" ring="none"></astro-rashi>

<!-- 3. Authentic 3D Gold Medallion on Crimson Background -->
<astro-rashi icon="kanya" size="64" color="#facc15" bg="#781d1d" ring="#facc15" effect="medallion" radius="50%"></astro-rashi>

<!-- 4. Tactical 3D Raised Button -->
<astro-rashi icon="makara" size="56" color="#ffffff" bg="#111827" ring="#38bdf8" effect="button" radius="12"></astro-rashi>
```

---

### 2. React (Next.js / Vite / CRA / Remix)

Import the `<Rashi />` React component:

```jsx
import React from 'react';
import { Rashi } from '@astro/icons/react';

export function HoroscopeCard() {
  return (
    <div className="card">
      {/* Flat Transparent Icon */}
      <Rashi 
        icon="simha" 
        size={36} 
        color="#facc15" 
        bg="transparent" 
        ring="none" 
      />

      {/* 3D Gold Medallion with Custom Rim */}
      <Rashi 
        icon="kanya" 
        size={64} 
        color="#facc15" 
        bg="#781d1d" 
        ring="#facc15" 
        effect="medallion" 
        radius="50%" 
      />

      {/* Force Detailed Variant */}
      <Rashi 
        icon="dhanus" 
        size={96} 
        color="#ffffff" 
        bg="#0f172a" 
        variant="detailed" 
        radius="16" 
      />
    </div>
  );
}
```

---

### 3. Direct SVG Imports (Framework-Agnostic)

All 12 icons are available as standalone SVGs in both Detailed and Clean Compact variants:

- **Detailed SVGs**: `node_modules/@astro/icons/src/rashi/[icon].svg`
- **Clean Compact SVGs**: `node_modules/@astro/icons/src/rashi/compact/[icon].svg`

#### Using with Vite / Webpack / Next.js Image:

```jsx
import SimhaDetailed from '@astro/icons/src/rashi/simha.svg';
import SimhaCompact from '@astro/icons/src/rashi/compact/simha.svg';

<img src={SimhaDetailed} width={64} height={64} alt="Simha" />
```

---

## 📜 12 Rāśi ID Reference

| ID | Sanskrit Name | Tamil Name (தமிழ்) | Symbol | Ruling Planet | Element |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `mesha` | Meṣa | மேஷம் | Ram / Aries | Mars (செவ்வாய்) | Fire |
| `rishabha` | Vṛṣabha | ரிஷபம் | Bull / Taurus | Venus (சுக்கிரன்) | Earth |
| `mithuna` | Mithuna | மிதுனம் | Twins / Gemini | Mercury (புதன்) | Air |
| `kataka` | Karkaṭa | கடகம் | Crab / Cancer | Moon (சந்திரன்) | Water |
| `simha` | Siṃha | சிம்மம் | Lion / Leo | Sun (சூரியன்) | Fire |
| `kanya` | Kanyā | கன்னி | Maiden / Virgo | Mercury (புதன்) | Earth |
| `thula` | Tulā | துலாம் | Balance Scales / Libra | Venus (சுக்கிரன்) | Air |
| `vrischika` | Vṛścika | விருச்சிகம் | Scorpion / Scorpio | Mars (செவ்வாய்) | Water |
| `dhanus` | Dhanus | தனுசு | Bow & Arrow / Sagittarius | Jupiter (குரு) | Fire |
| `makara` | Makara | மகரம் | Makara Sea-Beast / Capricorn | Saturn (சனி) | Earth |
| `kumbha` | Kumbha | கும்பம் | Kalasha Water Pot / Aquarius | Saturn (சனி) | Air |
| `meena` | Mīna | மீனம் | Twin Fish / Pisces | Jupiter (குரு) | Water |

---

## ⚙️ Attributes / Props Reference

| Attribute (HTML) | Prop (React) | Type | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `icon` | `icon` | `string` | **(Required)** | One of the 12 Rāśi IDs (e.g. `simha`, `kanya`, `mesha`) |
| `size` | `size` | `number \| string` | `24` | Width & height in pixels (e.g. `24`, `36`, `48`, `64`, `128`) |
| `color` | `color` | `string` | `"currentColor"` | Foreground color of the icon path (e.g. `#facc15`, `white`) |
| `bg` | `bg` | `string` | `"transparent"` | Background color. Use `"none"` or `"transparent"` for 100% alpha transparency. |
| `ring` | `ring` | `string` | `"none"` | Outer border/rim contrast color. Use `"none"` to remove the border completely. |
| `effect` | `effect` | `string` | `"none"` | 3D lighting effect: `"none"`, `"medallion"`, `"button"`, `"glass"`, `"emboss"`, `"glow"` |
| `radius` | `radius` | `string` | `"0"` | Border radius: `"50%"`, `"circle"`, `"16"`, `"8"`, `"0"` |
| `variant` | `variant` | `string` | `"auto"` | Optical cut: `"auto"` ($<48\text{px}$ compact, $\ge 48\text{px}$ detailed), `"compact"`, `"detailed"` |
| `padding` | `padding` | `string` | `auto` | Inner padding. Defaults to `0px` when background is transparent. |
| `border` | `border` | `string` | `auto` | Custom CSS border override (e.g. `2px dashed gold`) |

---

## 🎨 Visual Effects Guide

### 1. Pure Flat Vector (`effect="none"`)
No shadows or borders. Pure, crisp vector silhouette inheriting parent text color.
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

## 💻 CSS Variables Styling

You can also style `<astro-rashi>` components dynamically using CSS Custom Properties:

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

To explore and test all 12 icons in real time with live color pickers, dual comparison panes, and multi-scale matrix:

```bash
npm run dev
```

Open your browser at `http://localhost:5173` to launch the **12 Rāśi Multi-Scale & 3D Medallion Studio**.

---

## 📄 License

MIT License. Free for personal and commercial astrology applications, horoscopes, panchangam software, and web portals.
