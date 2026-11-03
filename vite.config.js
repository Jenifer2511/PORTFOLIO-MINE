import { defineConfig, build } from "vite";
import react from "@vitejs/plugin-react";
import { readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import path from "node:path";

// Build-time React rendering requires no web server or backend at deployment.
function prerenderPortfolio() {
  let root;
  return {
    name: "prerender-react-portfolio",
    apply: "build",
    configResolved(config) { root = config.root; },
    async closeBundle() {
      const output = path.join(root, "node_modules/.vite/portfolio-prerender");
      await build({
        root, configFile: false, plugins: [react()], logLevel: "error",
        build: {
          ssr: path.join(root, "src/entry-server.jsx"),
          outDir: output, emptyOutDir: true,
          rollupOptions: { output: { entryFileNames: "entry-server.mjs", chunkFileNames: "[name]-[hash].mjs" } },
        },
      });
      const module = await import(pathToFileURL(path.join(output, "entry-server.mjs")).href + `?build=${Date.now()}`);
      const file = path.join(root, "dist/index.html");
      const html = await readFile(file, "utf8");
      await writeFile(file, html.replace("<!--app-html-->", module.render()));
    },
  };
}
export default defineConfig({ plugins: [react(), prerenderPortfolio()] });
