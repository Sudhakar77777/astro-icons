import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { rashiIcons, detailedIcons, compactIcons, AstroRashi, RashiIcon } from "../dist/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

describe("Astro Icons Library Unit Tests", () => {
    const EXPECTED_RASHIS = [
        "mesha", "rishabha", "mithuna", "kataka",
        "simha", "kanya", "thula", "vrischika",
        "dhanus", "makara", "kumbha", "meena"
    ];

    it("should export exactly 12 canonical rashis in rashiIcons", () => {
        assert.equal(rashiIcons.length, 12);
        assert.deepEqual([...rashiIcons], EXPECTED_RASHIS);
    });

    it("should export AstroRashi and RashiIcon classes", () => {
        assert.ok(AstroRashi, "AstroRashi should be defined");
        assert.ok(RashiIcon, "RashiIcon should be defined");
        assert.equal(AstroRashi, RashiIcon, "RashiIcon should be an alias of AstroRashi");
    });

    it("should export all 12 detailed SVG icons with valid SVG structure", () => {
        EXPECTED_RASHIS.forEach(id => {
            const svg = detailedIcons[id];
            assert.ok(svg, `Missing detailed icon for ${id}`);
            assert.ok(typeof svg === "string", `Detailed icon for ${id} must be a string`);
            assert.ok(svg.includes("<svg"), `Detailed icon ${id} must contain <svg`);
            assert.ok(svg.includes("viewBox="), `Detailed icon ${id} must have viewBox attribute`);
        });
    });

    it("should export all 12 compact micro-cut SVG icons with valid SVG structure", () => {
        EXPECTED_RASHIS.forEach(id => {
            const svg = compactIcons[id];
            assert.ok(svg, `Missing compact icon for ${id}`);
            assert.ok(typeof svg === "string", `Compact icon for ${id} must be a string`);
            assert.ok(svg.includes("<svg"), `Compact icon ${id} must contain <svg`);
            assert.ok(svg.includes("viewBox="), `Compact icon ${id} must have viewBox attribute`);
        });
    });

    it("should verify raw SVG asset files exist in src/rashi and src/rashi/compact", () => {
        EXPECTED_RASHIS.forEach(id => {
            const detailedSvg = path.join(rootDir, "src", "rashi", `${id}.svg`);
            const compactSvg = path.join(rootDir, "src", "rashi", "compact", `${id}.svg`);
            assert.ok(fs.existsSync(detailedSvg), `Detailed SVG missing: ${detailedSvg}`);
            assert.ok(fs.existsSync(compactSvg), `Compact SVG missing: ${compactSvg}`);
            
            const detailedContent = fs.readFileSync(detailedSvg, "utf-8");
            const compactContent = fs.readFileSync(compactSvg, "utf-8");
            assert.ok(detailedContent.length > 50, `Detailed SVG ${id} is too small`);
            assert.ok(compactContent.length > 50, `Compact SVG ${id} is too small`);
        });
    });
});
