import React from "react";
import "./components/rashi.js";

/**
 * Astro Icons — Vedic Rāśi React Component
 * 
 * @param {Object} props
 * @param {string} props.icon - Rāśi identifier: 'mesha' | 'rishabha' | 'mithuna' | 'kataka' | 'simha' | 'kanya' | 'thula' | 'vrischika' | 'dhanus' | 'makara' | 'kumbha' | 'meena'
 * @param {number|string} [props.size=24] - Size in pixels (e.g. 24, 36, 48, 64, 128)
 * @param {string} [props.color="currentColor"] - Foreground icon stroke/fill color
 * @param {string} [props.bg="transparent"] - Background color or 'transparent' / 'none'
 * @param {string} [props.ring="none"] - Outer rim/border color or 'none'
 * @param {string} [props.effect="none"] - 3D Effect: 'none' | 'medallion' | 'button' | 'glass' | 'emboss' | 'glow'
 * @param {string} [props.radius="0"] - Border radius: '0' | '50%' | 'circle' | '16' | '8'
 * @param {string} [props.variant="auto"] - Optical detail cut: 'auto' | 'compact' | 'detailed'
 * @param {string} [props.className] - CSS class name
 * @param {Object} [props.style] - Inline CSS styles
 */
export function Rashi({
    icon,
    size = 24,
    color = "currentColor",
    bg = "transparent",
    ring = "none",
    effect = "none",
    radius = "0",
    variant = "auto",
    padding,
    border,
    className = "",
    style = {},
    ...rest
}) {
    return React.createElement("astro-rashi", {
        icon,
        size,
        color,
        bg,
        ring,
        effect,
        radius,
        variant,
        padding,
        border,
        class: className,
        style,
        ...rest
    });
}

export default Rashi;
