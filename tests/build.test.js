import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

describe("Package Configuration & Build Tests", () => {
    it("should have valid package.json configuration", () => {
        const pkgJsonPath = path.join(rootDir, "package.json");
        assert.ok(fs.existsSync(pkgJsonPath), "package.json must exist");

        const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, "utf-8"));
        assert.equal(pkg.name, "@arivedha/astro-icons");
        assert.equal(pkg.type, "module");
        assert.ok(pkg.version, "version must be set");
        assert.equal(pkg.main, "./dist/index.js");
        assert.equal(pkg.module, "./dist/index.js");
        assert.ok(pkg.exports["."], "exports . must be defined");
        assert.ok(pkg.exports["./rashi/*"], "exports ./rashi/* must be defined");
        assert.ok(pkg.exports["./rashi/compact/*"], "exports ./rashi/compact/* must be defined");
    });

    it("should verify dist/index.js is created and non-empty", () => {
        const distFile = path.join(rootDir, "dist", "index.js");
        assert.ok(fs.existsSync(distFile), "dist/index.js must exist");
        const content = fs.readFileSync(distFile, "utf-8");
        assert.ok(content.length > 1000, "dist/index.js must contain bundled library code");
    });

    it("should verify root index.html is valid interactive workbench", () => {
        const indexPath = path.join(rootDir, "index.html");
        assert.ok(fs.existsSync(indexPath), "index.html must exist");
        const content = fs.readFileSync(indexPath, "utf-8");
        assert.ok(content.includes("<astro-rashi"), "index.html must use <astro-rashi> component");
        assert.ok(content.includes("matrix-container"), "index.html must contain matrix container");
    });
});
