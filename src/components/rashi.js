// Load detailed icons
const detailedModules = import.meta.glob("../rashi/*.svg", {
    query: "?raw",
    import: "default",
    eager: true,
});

// Load compact pure-solid silhouette icons (zero internal detail)
const compactModules = import.meta.glob("../rashi/compact/*.svg", {
    query: "?raw",
    import: "default",
    eager: true,
});

const detailedIcons = {};
for (const [path, svg] of Object.entries(detailedModules)) {
    const name = path.split("/").pop().replace(".svg", "");
    detailedIcons[name] = svg;
}

const compactIcons = {};
for (const [path, svg] of Object.entries(compactModules)) {
    const name = path.split("/").pop().replace(".svg", "");
    compactIcons[name] = svg;
}

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

const BaseElement = typeof HTMLElement !== "undefined" ? HTMLElement : class {};

export class AstroRashi extends BaseElement {
    connectedCallback() {
        if (typeof document !== "undefined") {
            this.render();
        }
    }

    static get observedAttributes() {
        return ["icon", "size", "color", "bg", "radius", "variant", "effect", "padding", "border", "border-color", "ring", "glow"];
    }

    attributeChangedCallback() {
        if (typeof document !== "undefined") {
            this.render();
        }
    }

    render() {
        if (typeof document === "undefined") return;
        const getCssVar = (name) => {
            const inline = this.style.getPropertyValue(name);
            if (inline) return inline.trim();
            if (typeof window !== "undefined" && window.getComputedStyle) {
                return window.getComputedStyle(this).getPropertyValue(name).trim();
            }
            return "";
        };

        const name = this.getAttribute("icon") || getCssVar("--rashi-icon");
        const sizeAttr = this.getAttribute("size") || getCssVar("--rashi-size") || "24";
        const numericSize = parseInt(sizeAttr.toString().replace("px", ""), 10) || 24;
        
        const variantAttr = this.getAttribute("variant") || getCssVar("--rashi-variant") || "auto";

        const color = this.getAttribute("color") || getCssVar("--rashi-color") || "currentColor";
        
        // Background color handling: "none" or "transparent" is 100% transparent (no dark box)
        let bg = this.getAttribute("bg") || getCssVar("--rashi-bg") || "transparent";
        if (bg === "none" || bg === "null" || bg === "false") bg = "transparent";
        const isTransparentBg = bg === "transparent";

        const radius = this.getAttribute("radius") || getCssVar("--rashi-radius") || "0";
        const effect = this.getAttribute("effect") || getCssVar("--rashi-effect") || "none";
        const padAttr = this.getAttribute("padding") || getCssVar("--rashi-padding");
        
        // Customizable Outside Line / Rim Color: "none" or "transparent" removes border completely
        let ringColor = this.getAttribute("ring") || 
                        this.getAttribute("border-color") || 
                        getCssVar("--rashi-ring") || 
                        getCssVar("--rashi-border-color");

        if (!ringColor) {
            ringColor = (effect === "none" || isTransparentBg) ? "none" : color;
        }

        const hasBorder = ringColor && ringColor !== "none" && ringColor !== "transparent";
        const customBorder = this.getAttribute("border") || getCssVar("--rashi-border");

        // Optical Sizing selection
        let isCompact = false;
        if (variantAttr === "compact" || variantAttr === "clean" || variantAttr === "solid") {
            isCompact = true;
        } else if (variantAttr === "detailed") {
            isCompact = false;
        } else {
            // "auto" mode: use clean micro-cut for small UI sizes (< 48px)
            isCompact = numericSize < 48;
        }

        const iconPool = isCompact && compactIcons[name] ? compactIcons : detailedIcons;

        if (!name || !iconPool[name]) {
            console.warn(`Unknown rashi icon: "${name}". Valid icons: ${rashiIcons.join(", ")}`);
            this.innerHTML = "";
            return;
        }

        this.innerHTML = "";

        const wrapper = document.createElement("span");
        wrapper.className = `astro-rashi-wrapper effect-${effect}`;

        wrapper.style.display = "inline-flex";
        wrapper.style.width = `${numericSize}px`;
        wrapper.style.height = `${numericSize}px`;
        wrapper.style.alignItems = "center";
        wrapper.style.justifyContent = "center";
        wrapper.style.color = color;
        wrapper.style.backgroundColor = bg;
        wrapper.style.lineHeight = "0";
        wrapper.style.boxSizing = "border-box";
        wrapper.style.position = "relative";
        wrapper.style.userSelect = "none";
        wrapper.style.flexShrink = "0";

        // Border radius handling
        if (radius === "circle" || radius === "round" || radius === "50%") {
            wrapper.style.borderRadius = "50%";
        } else if (radius !== "0" && radius !== "none") {
            wrapper.style.borderRadius = radius.includes("px") || radius.includes("%") ? radius : `${radius}px`;
        } else {
            wrapper.style.borderRadius = "0";
        }

        // Inner padding: 0px when background is transparent/none (uses full icon footprint)
        let innerPadding = "0px";
        if (padAttr !== null && padAttr !== undefined && padAttr !== "") {
            innerPadding = padAttr.includes("px") || padAttr.includes("%") ? padAttr : `${padAttr}px`;
        } else if (!isTransparentBg) {
            innerPadding = `${Math.max(1, Math.round(numericSize * 0.04))}px`;
        }
        wrapper.style.padding = innerPadding;

        // Apply 3D Effects & Styles with Dynamic Customizable Outside Line / Rim Color
        const borderWidth = Math.max(1.5, Math.round(numericSize * 0.035));

        if (effect === "button" && !isTransparentBg) {
            wrapper.style.boxShadow = `
                0 ${Math.max(2, Math.round(numericSize * 0.04))}px ${Math.max(4, Math.round(numericSize * 0.1))}px rgba(0, 0, 0, 0.5),
                inset 0 1px 1px rgba(255, 255, 255, 0.3),
                inset 0 -${Math.max(1, Math.round(numericSize * 0.03))}px ${Math.max(2, Math.round(numericSize * 0.05))}px rgba(0, 0, 0, 0.6)
            `;
            if (customBorder) {
                wrapper.style.border = customBorder;
            } else if (hasBorder) {
                wrapper.style.border = `${borderWidth}px solid ${ringColor}`;
            } else {
                wrapper.style.border = "none";
            }
        } else if (effect === "medallion" && !isTransparentBg) {
            wrapper.style.boxShadow = `
                0 ${Math.max(3, Math.round(numericSize * 0.06))}px ${Math.max(8, Math.round(numericSize * 0.14))}px rgba(0, 0, 0, 0.6),
                0 0 ${Math.max(4, Math.round(numericSize * 0.08))}px ${hasBorder ? ringColor + '44' : 'transparent'},
                inset 0 1px 2px rgba(255, 255, 255, 0.4),
                inset 0 -2px 4px rgba(0, 0, 0, 0.65)
            `;
            if (customBorder) {
                wrapper.style.border = customBorder;
            } else if (hasBorder) {
                wrapper.style.border = `${borderWidth}px solid ${ringColor}`;
            } else {
                wrapper.style.border = "none";
            }
        } else if ((effect === "emboss" || effect === "inset") && !isTransparentBg) {
            wrapper.style.boxShadow = `
                inset 0 ${Math.max(2, Math.round(numericSize * 0.04))}px ${Math.max(4, Math.round(numericSize * 0.08))}px rgba(0, 0, 0, 0.75),
                inset 0 -1px 1px rgba(255, 255, 255, 0.15)
            `;
            if (customBorder) {
                wrapper.style.border = customBorder;
            } else if (hasBorder) {
                wrapper.style.border = `${borderWidth}px solid ${ringColor}66`;
            } else {
                wrapper.style.border = "none";
            }
        } else if (effect === "glass") {
            wrapper.style.backdropFilter = "blur(12px)";
            wrapper.style.webkitBackdropFilter = "blur(12px)";
            wrapper.style.boxShadow = `
                0 8px 32px rgba(0, 0, 0, 0.4),
                inset 0 1px 1px rgba(255, 255, 255, 0.25)
            `;
            if (customBorder) {
                wrapper.style.border = customBorder;
            } else if (hasBorder) {
                wrapper.style.border = `${borderWidth}px solid ${ringColor}88`;
            } else {
                wrapper.style.border = "none";
            }
        } else if (effect === "glow") {
            wrapper.style.boxShadow = `0 0 ${Math.max(6, Math.round(numericSize * 0.15))}px ${hasBorder ? ringColor : color}`;
            if (customBorder) {
                wrapper.style.border = customBorder;
            } else if (hasBorder) {
                wrapper.style.border = `${borderWidth}px solid ${ringColor}`;
            } else {
                wrapper.style.border = "none";
            }
        } else {
            // Flat 2D (pure clean rendering without box-shadow)
            wrapper.style.boxShadow = "none";
            if (customBorder && customBorder !== "none") {
                wrapper.style.border = customBorder;
            } else if (hasBorder) {
                wrapper.style.border = `${borderWidth}px solid ${ringColor}`;
            } else {
                wrapper.style.border = "none";
            }
        }

        // Insert SVG content
        wrapper.innerHTML = iconPool[name];

        const svg = wrapper.querySelector("svg");
        if (svg) {
            svg.setAttribute("width", "100%");
            svg.setAttribute("height", "100%");
            svg.setAttribute("aria-hidden", "true");
            svg.style.display = "block";
            svg.style.flexShrink = "0";

            if ((effect === "medallion" || effect === "button") && !isTransparentBg) {
                svg.style.filter = "drop-shadow(0 1px 2px rgba(0,0,0,0.5))";
            } else {
                svg.style.filter = "none";
            }
        }

        this.appendChild(wrapper);
    }
}

if (typeof customElements !== "undefined" && !customElements.get("astro-rashi")) {
    customElements.define("astro-rashi", AstroRashi);
}

export { AstroRashi as RashiIcon, detailedIcons, compactIcons };