/** Build a portable HTML document with inline JS, CSS, fonts, and personal assets.
 * Opens directly from disk: the WebGL textures use data URLs, not remote requests. */
import { build } from "vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const mime = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".pdf": "application/pdf",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
};
const toData = async (file) =>
  `data:${mime[path.extname(file)] || "application/octet-stream"};base64,${(await fs.readFile(file)).toString("base64")}`;
const result = await build({
  configFile: false,
  root,
  plugins: [react()],
  logLevel: "error",
  define: { "process.env.NODE_ENV": JSON.stringify("production") },
  build: {
    write: false,
    minify: true,
    lib: {
      entry: path.join(root, "src/main.jsx"),
      name: "JeniferPortfolio",
      formats: ["iife"],
    },
    rollupOptions: { output: { inlineDynamicImports: true } },
  },
});
const outputs = Array.isArray(result)
  ? result.flatMap((item) => item.output)
  : result.output;
let script = outputs.find((item) => item.type === "chunk").code;
let html = await fs.readFile(path.join(root, "dist/index.html"), "utf8");
const distAssets = await fs.readdir(path.join(root, "dist/assets"));
let css = "";
for (const file of distAssets.filter((file) => file.endsWith(".css")))
  css += await fs.readFile(path.join(root, "dist/assets", file), "utf8");
for (const file of distAssets.filter((file) => /\.woff2?$/.test(file)))
  css = css
    .split(`/assets/${file}`)
    .join(await toData(path.join(root, "dist/assets", file)));
const files = [
  "favicon.svg",
  "Jenifer-J-Resume.pdf",
  "Python-Full-Stack-Certificate.pdf",
  ...(await fs.readdir(path.join(root, "public/images"))).map(
    (file) => `images/${file}`,
  ),
];
for (const file of files) {
  const data = await toData(path.join(root, "public", file));
  script = script.split(`/${file}`).join(data);
  html = html.split(`/${file}`).join(data);
}
html = html.replace(
  /\s*<link\b[^>]*rel="(?:stylesheet|modulepreload|preload)"[^>]*>/g,
  "",
);
html = html.replace(/<script\b[^>]*type="module"[^>]*>[\s\S]*?<\/script>/g, "");
html = html.replace(
  "</body>",
  () =>
    `<script>${script.replace(/<\/script/gi, "<\\/script")}</script></body>`,
);
const licenses = await fs.readFile(
  path.join(root, "public/THIRD-PARTY-LICENSES.txt"),
  "utf8",
);
html = html.replace(
  "</head>",
  () =>
    `<!-- Third-party software and font licenses\n${licenses.replaceAll("--", "—")}\n--><style>${css}</style></head>`,
);
const destination = path.join(root, "artifacts/Jenifer-Portfolio.html");
await fs.mkdir(path.dirname(destination), { recursive: true });
await fs.writeFile(destination, html);
console.log(
  `Portable portfolio saved: ${destination} (${(Buffer.byteLength(html) / 1024 / 1024).toFixed(1)} MB)`,
);
