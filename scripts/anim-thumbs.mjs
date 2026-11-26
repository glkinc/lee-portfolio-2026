#!/usr/bin/env node
/**
 * Prepares animated SVG thumbnails exported from Figma for the site.
 *
 *   npm run thumbs
 *
 * For every src/assets/thumbs/<slug>-thumb.svg it writes
 * src/assets/thumbs/generated/<slug>.ts (plus image files) that the case study
 * data imports. Re-run it whenever you re-export a thumbnail.
 *
 * What it does to each export:
 * - Pulls the embedded base64 PNGs out into a resized JPG (colour) plus a
 *   small greyscale PNG used as an SVG mask (transparency), so a 3MB export
 *   becomes ~100KB and still keeps its see-through edges.
 * - Turns the looping CSS animations into paused, play-once animations
 *   (`both paused`), which AnimatedThumb plays forward on hover and backward
 *   on leave.
 * - Prefixes every id, url(#…) and keyframe name with the slug so several
 *   thumbnails can sit on one page.
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(root, "src/assets/thumbs");
const out = join(dir, "generated");
const splitAlpha = join(root, "scripts/split-alpha.py");
/** Longest side of extracted images, in px (~2× their on-screen size). */
const MAX_IMAGE = 960;
/** Opaque photos / screenshots (JPEG exports) are shown smaller, so they get a lower cap. */
const MAX_PHOTO = 720;

mkdirSync(out, { recursive: true });
const files = readdirSync(dir).filter((f) => f.endsWith("-thumb.svg"));
if (!files.length) console.log("No *-thumb.svg files in src/assets/thumbs.");

for (const file of files) {
  const slug = file.replace(/-thumb\.svg$/, "");
  let svg = readFileSync(join(dir, file), "utf8");
  const tmp = mkdtempSync(join(tmpdir(), "anim-thumb-"));

  const rootTag = svg.match(/<svg\b[^>]*>/)[0];
  const attr = (tag, name) => tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];
  const [, , width, height] = (attr(rootTag, "viewBox") ?? `0 0 ${attr(rootTag, "width")} ${attr(rootTag, "height")}`)
    .split(/\s+/)
    .map(Number);
  // The first solid rect is the artwork's background; it fills behind the
  // thumbnail too, and behind transparent image edges.
  const named = { white: "#ffffff", black: "#000000" };
  const bgFill = svg.match(/<rect\b[^>]*\bfill="(#[0-9a-fA-F]{6}|white|black)"/)?.[1];
  const background = named[bgFill] ?? bgFill ?? "#000000";

  // 1. Embedded images → JPG (+ alpha mask PNG when the export is a transparent PNG).
  const imports = [];
  let n = 0;
  svg = svg.replace(/<image\b([^>]*?)\s(?:xlink:)?href="data:image\/(png|jpeg|jpg);base64,([^"]+)"([^>]*)\/?>(?:<\/image>)?/g, (_, pre, kind, b64, post) => {
    const i = n++;
    const id = attr(pre + post, "id");
    const isPng = kind === "png";
    const src = join(tmp, `${i}.${isPng ? "png" : "jpg"}`);
    writeFileSync(src, Buffer.from(b64, "base64"));
    execFileSync("sips", ["-Z", String(isPng ? MAX_IMAGE : MAX_PHOTO), src, "--out", src], { stdio: "ignore" });
    const jpg = `${slug}-${i}.jpg`;
    const rest = (pre + post).replace(/\s*\/$/, "");
    if (isPng) {
      const rgb = join(tmp, `${i}-rgb.png`);
      const mask = `${slug}-${i}-alpha.png`;
      execFileSync("python3", ["-I", splitAlpha, src, rgb, join(out, mask), background]);
      execFileSync("sips", ["-s", "format", "jpeg", "-s", "formatOptions", "82", rgb, "--out", join(out, jpg)], {
        stdio: "ignore",
      });
      imports.push({ img: `img${i}`, jpg, mask: `mask${i}`, maskFile: mask });
      return (
        `<image${rest} href="__IMG_${i}__"/>` +
        `<image${rest.replace(`id="${id}"`, `id="${id}-alpha"`)} href="__MASK_${i}__"/>`
      );
    }
    // Opaque JPEG: just recompress at the target size.
    execFileSync("sips", ["-s", "format", "jpeg", "-s", "formatOptions", "82", src, "--out", join(out, jpg)], {
      stdio: "ignore",
    });
    imports.push({ img: `img${i}`, jpg });
    return `<image${rest} href="__IMG_${i}__"/>`;
  });

  // 2. Patterns that show an image get a matching luminance mask, applied to
  //    whatever the pattern fills.
  svg = svg.replace(/<pattern\b[^>]*\bid="([^"]+)"[^>]*>\s*<use\b([^>]*)\/>\s*<\/pattern>/g, (whole, pid, useAttrs) => {
    const ref = useAttrs.match(/href="#([^"]+)"/)[1];
    if (!svg.includes(`id="${ref}-alpha"`)) return whole;
    const alphaUse = useAttrs.replace(`#${ref}`, `#${ref}-alpha`);
    return `${whole}\n<mask id="${pid}-mask" maskContentUnits="objectBoundingBox"><use${alphaUse}/></mask>`;
  });
  for (const [, pid] of svg.matchAll(/<mask id="([^"]+)-mask"/g)) {
    svg = svg.replaceAll(`fill="url(#${pid})"`, `fill="url(#${pid})" mask="url(#${pid}-mask)"`);
  }

  // 2b. Figma exports a width-animated ellipse as <circle><animate attributeName="width"/></circle>.
  //     That is SMIL (can't be paused/reversed) and `width` isn't a circle attribute, so it does
  //     nothing. Turn it into a CSS scaleX about the centre; non-scaling-stroke keeps the line weight.
  let smilStyle = "";
  svg = svg.replace(
    /<circle\b([^>]*?)>\s*<animate attributeName="width"\s+values="([^"]+)"\s+keyTimes="([^"]+)"\s+dur="([\d.]+)s"[^>]*\/>\s*<\/circle>/g,
    (_, attrs, values, keyTimes, dur) => {
      const id = attr(attrs, "id");
      const r = Number(attr(attrs, "r"));
      const transform = attr(attrs, "transform");
      const rest = attrs.replace(/\s*\btransform="[^"]*"/, "").replace(/\s*\bid="[^"]*"/, "");
      const v = values.split(";").map((x) => Number(x.trim()));
      const t = keyTimes.split(";").map((x) => Number(x.trim()));
      const frames = v
        .map((w, i) => `${+(t[i] * 100).toFixed(3)}% { transform: scaleX(${+Math.max(w / (2 * r), 0.01).toFixed(4)}); }`)
        .join(" ");
      smilStyle += `@keyframes kf_${id}_width { ${frames} }\n#${id} { transform-box: fill-box; transform-origin: center; animation: kf_${id}_width ${dur}s linear infinite; }\n`;
      const circle = `<circle id="${id}"${rest} vector-effect="non-scaling-stroke"/>`;
      return transform ? `<g transform="${transform}">${circle}</g>` : circle;
    },
  );

  // 3. Animations: looping → paused, play-once, held at either end.
  let style = svg.match(/<style>([\s\S]*?)<\/style>/)?.[1] ?? "";
  svg = svg.replace(/<style>[\s\S]*?<\/style>\s*/, "");
  style = (style + "\n" + smilStyle).replace(/\binfinite\b/g, "both paused");

  // 4. Namespace ids, references and keyframes with the slug.
  const ids = [...svg.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]).sort((a, b) => b.length - a.length);
  const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  for (const id of ids) {
    const ns = `${slug}--${id}`;
    svg = svg
      .replaceAll(`id="${id}"`, `id="${ns}"`)
      .replaceAll(`url(#${id})`, `url(#${ns})`)
      .replaceAll(`href="#${id}"`, `href="#${ns}"`);
    style = style.replace(new RegExp(`#${esc(id)}(?=[\\s{,:.])`, "g"), `.anim-thumb #${ns}`);
  }
  style = style.replace(/\bkf_/g, `${slug}--kf_`);

  const body = svg
    .replace(/^[\s\S]*?<svg\b[^>]*>/, "")
    .replace(/<\/svg>\s*$/, "")
    .trim();
  // The export's <svg fill="none"> is dropped with the root tag; keep it, or open
  // paths render with the default black fill.
  const rootFill = attr(rootTag, "fill");
  const inner = rootFill ? `<g fill="${rootFill}">${body}</g>` : body;
  const markup = `<style>${style.trim()}</style>\n${inner}`;

  const ts = `// Generated by scripts/anim-thumbs.mjs from ../${file}. Don't edit; re-run \`npm run thumbs\`.
${imports.map((m) => `import ${m.img} from "./${m.jpg}";` + (m.mask ? `\nimport ${m.mask} from "./${m.maskFile}";` : "")).join("\n")}

const raw = ${JSON.stringify(markup)};

export default {
  markup: raw${imports.map((m, i) => `\n    .replace("__IMG_${i}__", ${m.img})` + (m.mask ? `\n    .replace("__MASK_${i}__", ${m.mask})` : "")).join("")},
  width: ${width},
  height: ${height},
  background: ${JSON.stringify(background)},
};
`;
  writeFileSync(join(out, `${slug}.ts`), ts);
  rmSync(tmp, { recursive: true, force: true });
  console.log(`${file} → generated/${slug}.ts (${imports.length} image${imports.length === 1 ? "" : "s"}, bg ${background})`);
}
