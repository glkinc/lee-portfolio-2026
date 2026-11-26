import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { App } from "./App";
import { parseRoute, routePath, type Route } from "./lib/router";
import { renderHeadTags } from "./lib/seo";
import { caseStudies } from "./data/caseStudies";

/** Every URL that gets a static HTML file. */
export const routes: Route[] = [
  { name: "home" },
  ...caseStudies.map((cs) => ({ name: "case-study" as const, slug: cs.slug })),
];

export function render(url: string) {
  const route = parseRoute(url);
  const html = renderToString(
    <StrictMode>
      <App initialRoute={route} />
    </StrictMode>,
  );
  return { html, head: renderHeadTags(route), path: routePath(route) };
}

export { routePath };

import { SITE_URL, experience, site, skills } from "./data/site";
import { caseStudyPath } from "./data/caseStudies";

/** /llms.txt — a plain-language summary for AI answer engines (GEO). */
export function llmsTxt() {
  const lines = [
    `# ${site.name}`,
    "",
    `> ${site.description}`,
    "",
    `${site.intro}`,
    "",
    `- Location: ${site.location}`,
    `- Email: ${site.email}`,
    `- LinkedIn: ${site.social.linkedin}`,
    `- Medium: ${site.social.medium}`,
    `- Dribbble: ${site.social.dribbble}`,
    `- Studio: ${site.studio.name} (${site.studio.url})`,
    "",
    "## Case studies",
    "",
    ...caseStudies.map((cs) => `- [${cs.name} — ${cs.category}](${SITE_URL}${caseStudyPath(cs.slug)}): ${cs.seo.description}`),
    "",
    "## Experience",
    "",
    ...experience.map((e) => `- ${e.role}, ${e.company} (${e.dates}), ${e.location}`),
    "",
    "## Skills",
    "",
    ...skills.map((s) => `- ${s.title}: ${s.body}`),
    "",
  ];
  return lines.join("\n");
}

export function sitemapXml(lastmod: string) {
  const urls = routes.map((r) => `${SITE_URL}${routePath(r)}`);
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u}</loc><lastmod>${lastmod}</lastmod></url>`).join("\n")}
</urlset>
`;
}
