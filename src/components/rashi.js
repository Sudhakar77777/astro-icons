// Load detailed icons
const detailedModules = import.meta.glob("../rashi/*.svg", {
    query: "?raw",
    import: "default",
    eager: true,
});

// Load compact micro-cut icons
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

class RashiIcon extends HTMLElement {
    connectedCallback() {
        this.render();
    }

    static get observedAttributes() {
        return ["icon", "size", "color", "bg", "radius", "variant", "effect", "padding", "border", "border-color", "ring", "glow"];
    }

    attributeChangedCallback() {
        this.render();
    }

    render() {
        const name = this.getAttribute("icon");
        const sizeAttr = this.getAttribute("size") || "24";
        const numericSize = parseInt(sizeAttr, 10) || 24;
        
        const variantAttr = this.getAttribute("variant") || "auto";
        const color = this.getAttribute("color") || this.style.getPropertyValue("--rashi-color") || "currentColor";
        const bg = this.getAttribute("bg") || this.style.getPropertyValue("--rashi-bg") || "transparent";
        const radius = this.getAttribute("radius") || this.style.getPropertyValue("--rashi-radius") || "0";
        const effect = this.getAttribute("effect") || this.style.getPropertyValue("--rashi-effect") || "none";
        const padAttr = this.getAttribute("padding");
        
        // Customizable Outside Line / Rim Color
        const ringColor = this.getAttribute("ring") || 
                          this.getAttribute("border-color") || 
                          this.style.getPropertyValue("--rashi-ring") || 
                          this.style.getPropertyValue("--rashi-border-color") || 
                          color;

        const customBorder = this.getAttribute("border");

        // Optical Sizing selection
        let isCompact = false;
        if (variantAttr === "compact") {
            isCompact = true;
        } else if (variantAttr === "detailed") {
            isCompact = false;
        } else {
            // "auto" mode: use compact for small UI sizes (< 48px)
            isCompact = numericSize < 48;
        }

        const iconPool = isCompact && compactIcons[name] ? compactIcons : detailedIcons;

        if (!name || !iconPool[name]) {
            console.warn(`Unknown rashi icon: ${name} (variant: ${isCompact ? "compact" : "detailed"})`);
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
        } else if (radius !== "0") {
            wrapper.style.borderRadius = radius.includes("px") || radius.includes("%") ? radius : `${radius}px`;
        } else {
            wrapper.style.borderRadius = "var(--rashi-radius, 0)";
        }

        // Tight comfortable inner padding (defaults to 4-6% max so icon fills frame)
        let innerPadding = "0px";
        if (padAttr !== null && padAttr !== undefined && padAttr !== "") {
            innerPadding = padAttr.includes("px") || padAttr.includes("%") ? padAttr : `${padAttr}px`;
        } else if (bg !== "transparent" || effect !== "none") {
            // Minimal 4-6% padding so icon image is large and impactful
            innerPadding = `${Math.max(1, Math.round(numericSize * 0.05))}px`;
        }
        wrapper.style.padding = innerPadding;

        // Apply 3D Effects & Styles with Dynamic Customizable Outside Line / Rim Color
        const borderWidth = Math.max(1.5, Math.round(numericSize * 0.035));

        if (effect === "button") {
            // 3D Raised Push Button with customizable rim color and elevation
            wrapper.style.boxShadow = `
                0 ${Math.max(2, Math.round(numericSize * 0.04))}px ${Math.max(4, Math.round(numericSize * 0.1))}px rgba(0, 0, 0, 0.5),
                inset 0 1px 1px rgba(255, 255, 255, 0.3),
                inset 0 -${Math.max(1, Math.round(numericSize * 0.03))}px ${Math.max(2, Math.round(numericSize * 0.05))}px rgba(0, 0, 0, 0.6)
            `;
            wrapper.style.border = customBorder || `${borderWidth}px solid ${ringColor}`;
        } else if (effect === "medallion") {
            // 3D Medallion with custom colored outside line / rim and specular glow
            wrapper.style.boxShadow = `
                0 ${Math.max(3, Math.round(numericSize * 0.06))}px ${Math.max(8, Math.round(numericSize * 0.14))}px rgba(0, 0, 0, 0.6),
                0 0 ${Math.max(4, Math.round(numericSize * 0.08))}px ${ringColor}44,
                inset 0 1px 2px rgba(255, 255, 255, 0.4),
                inset 0 -2px 4px rgba(0, 0, 0, 0.65)
            `;
            wrapper.style.border = customBorder || `${borderWidth}px solid ${ringColor}`;
        } else if (effect === "emboss" || effect === "inset") {
            // Inset / Engraved Stone
            wrapper.style.boxShadow = `
                inset 0 ${Math.max(2, Math.round(numericSize * 0.04))}px ${Math.max(4, Math.round(numericSize * 0.08))}px rgba(0, 0, 0, 0.75),
                inset 0 -1px 1px rgba(255, 255, 255, 0.15)
            `;
            wrapper.style.border = customBorder || `${borderWidth}px solid ${ringColor}66`;
        } else if (effect === "glass") {
            // Glassmorphism
            wrapper.style.backdropFilter = "blur(12px)";
            wrapper.style.webkitBackdropFilter = "blur(12px)";
            wrapper.style.boxShadow = `
                0 8px 32px rgba(0, 0, 0, 0.4),
                inset 0 1px 1px rgba(255, 255, 255, 0.25)
            `;
            wrapper.style.border = customBorder || `${borderWidth}px solid ${ringColor}88`;
        } else if (effect === "glow") {
            // Ambient Aura Glow
            wrapper.style.boxShadow = `0 0 ${Math.max(6, Math.round(numericSize * 0.15))}px ${ringColor}`;
            wrapper.style.border = customBorder || `${borderWidth}px solid ${ringColor}`;
        } else if (customBorder) {
            wrapper.style.border = customBorder;
        } else if (ringColor && ringColor !== "currentColor" && ringColor !== color) {
            wrapper.style.border = `${borderWidth}px solid ${ringColor}`;
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

            if (effect === "medallion" || effect === "button") {
                svg.style.filter = "drop-shadow(0 1px 2px rgba(0,0,0,0.5))";
            }
        }

        this.appendChild(wrapper);
    }
}

if (!customElements.get("astro-rashi")) {
    customElements.define("astro-rashi", RashiIcon);
}