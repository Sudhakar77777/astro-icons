import { defineConfig } from "vite";

export default defineConfig({
    base: "/astro-icons/",
    build: {
        outDir: "dist-demo",
        emptyOutDir: true,
    },
});
