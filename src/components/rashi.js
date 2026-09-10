const modules = import.meta.glob("../rashi/*.svg", {
    query: "?raw",
    import: "default",
    eager: true,
});

const icons = {};

for (const [path, svg] of Object.entries(modules)) {
    const name = path.split("/").pop().replace(".svg", "");
    icons[name] = svg;
}

class RashiIcon extends HTMLElement {
    connectedCallback() {
        this.render();
    }

    static get observedAttributes() {
        return ["icon", "size", "color", "bg", "radius"];
    }

    attributeChangedCallback() {
        this.render();
    }

    render() {
        const name = this.getAttribute("icon");
        const size = this.getAttribute("size") || "24";
        const color = this.getAttribute("color") || this.style.getPropertyValue("--rashi-color") || "currentColor";
        const bg = this.getAttribute("bg") || this.style.getPropertyValue("--rashi-bg") || "transparent";
        const radius = this.getAttribute("radius") || this.style.getPropertyValue("--rashi-radius") || "0";

        if (!name || !icons[name]) {
            console.warn(`Unknown rashi icon: ${name}`);
            this.innerHTML = "";
            return;
        }

        this.innerHTML = "";

        const wrapper = document.createElement("span");

        wrapper.style.display = "inline-flex";
        wrapper.style.width = `${size}px`;
        wrapper.style.height = `${size}px`;
        wrapper.style.alignItems = "center";
        wrapper.style.justifyContent = "center";
        wrapper.style.color = color;
        wrapper.style.backgroundColor = bg || "transparent";
        wrapper.style.borderRadius = radius === "0" ? "var(--rashi-radius, 0)" : `${radius}px`;
        wrapper.style.lineHeight = "0";

        wrapper.innerHTML = icons[name];

        const svg = wrapper.querySelector("svg");

        if (svg) {
            svg.setAttribute("width", "100%");
            svg.setAttribute("height", "100%");
            svg.setAttribute("aria-hidden", "true");
            svg.style.display = "block";
        }

        this.appendChild(wrapper);
    }
}

customElements.define("astro-rashi", RashiIcon);