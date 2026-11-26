// Prerenders every route to static HTML so crawlers and AI engines get the
// full content (and per-page meta) without running JavaScript.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const ssrEntry = path.join(root, "dist-ssr", "entry-server.js");

const { render, routes, routePath, llmsTxt, sitemapXml } = await import(pathToFileURL(ssrEntry).href);
const template = fs.readFileSync(path.join(dist, "index.html"), "utf8");

for (const route of routes) {
  const url = routePath(route);
  const { html, head } = render(url);
  const page = template
    .replace(/<!--head:start-->[\s\S]*?<!--head:end-->/, head)
    .replace("<!--app-html-->", html);
  const file = path.join(dist, url, "index.html");
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, page);
  console.log(`  prerendered ${url}`);
}

fs.writeFileSync(path.join(dist, "sitemap.xml"), sitemapXml(new Date().toISOString().slice(0, 10)));
fs.writeFileSync(path.join(dist, "llms.txt"), llmsTxt());
fs.rmSync(path.join(root, "dist-ssr"), { recursive: true, force: true });
console.log("  wrote sitemap.xml, llms.txt");
