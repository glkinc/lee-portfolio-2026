import { SITE_URL, experience, site } from "../data/site";
import { caseStudies, caseStudyPath, getCaseStudy, type CaseStudy } from "../data/caseStudies";
import type { Route } from "./router";

interface HeadData {
  title: string;
  description: string;
  url: string;
  type: "website" | "article";
  jsonLd: object[];
}

const abs = (path: string) => `${SITE_URL}${path}`;

const person = {
  "@type": "Person",
  "@id": `${SITE_URL}/#person`,
  name: site.name,
  url: `${SITE_URL}/`,
  email: `mailto:${site.email}`,
  image: abs(site.ogImage),
  jobTitle: "Senior Product Designer",
  description: site.description,
  worksFor: { "@type": "Organization", name: "Priceline", url: "https://www.priceline.com" },
  address: { "@type": "PostalAddress", addressLocality: "Toronto", addressRegion: "ON", addressCountry: "CA" },
  knowsAbout: [
    "Design systems",
    "Product design",
    "UX design",
    "UI design",
    "Front-end development",
    "Storybook",
    "Figma",
    "Illustration",
    "Graphic design",
    "Creative direction",
  ],
  sameAs: [site.social.linkedin, site.social.medium, site.social.dribbble, site.studio.url],
};

const website = {
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: `${SITE_URL}/`,
  name: site.name,
  description: site.description,
  inLanguage: "en-CA",
  publisher: { "@id": `${SITE_URL}/#person` },
};

function caseStudyLd(cs: CaseStudy) {
  return {
    "@type": "CreativeWork",
    "@id": `${abs(caseStudyPath(cs.slug))}#work`,
    url: abs(caseStudyPath(cs.slug)),
    name: cs.title,
    headline: cs.title,
    alternativeHeadline: `${cs.name} — ${cs.category}`,
    description: cs.seo.description,
    abstract: cs.intro,
    genre: cs.category,
    keywords: cs.skills.join(", "),
    author: { "@id": `${SITE_URL}/#person` },
    creator: { "@id": `${SITE_URL}/#person` },
    isPartOf: { "@id": `${SITE_URL}/#website` },
    inLanguage: "en-CA",
  };
}

export function getHead(route: Route): HeadData {
  if (route.name === "case-study") {
    const cs = getCaseStudy(route.slug);
    if (cs) {
      const url = abs(caseStudyPath(cs.slug));
      return {
        title: `${cs.seo.title} | ${site.name}`,
        description: cs.seo.description,
        url,
        type: "article",
        jsonLd: [
          { ...caseStudyLd(cs), mainEntityOfPage: url },
          person,
          {
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: site.name, item: `${SITE_URL}/` },
              { "@type": "ListItem", position: 2, name: "Case studies", item: `${SITE_URL}/#case-studies` },
              { "@type": "ListItem", position: 3, name: cs.name, item: url },
            ],
          },
        ],
      };
    }
  }

  return {
    title: site.title,
    description: site.description,
    url: `${SITE_URL}/`,
    type: "website",
    jsonLd: [
      website,
      {
        "@type": "ProfilePage",
        "@id": `${SITE_URL}/#profile`,
        url: `${SITE_URL}/`,
        name: site.title,
        mainEntity: {
          ...person,
          hasOccupation: experience.map((e) => ({
            "@type": "Role",
            roleName: e.role,
            startDate: e.start,
            worksFor: { "@type": "Organization", name: e.company },
          })),
        },
      },
      {
        "@type": "ItemList",
        name: "Case studies",
        itemListElement: caseStudies.map((cs, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: abs(caseStudyPath(cs.slug)),
          name: `${cs.name} — ${cs.category}`,
        })),
      },
    ],
  };
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Serialises the head tags for the prerenderer. */
export function renderHeadTags(route: Route) {
  const h = getHead(route);
  const image = abs(site.ogImage);
  const ld = JSON.stringify({ "@context": "https://schema.org", "@graph": h.jsonLd }).replace(/</g, "\\u003c");
  return [
    `<title>${esc(h.title)}</title>`,
    `<meta name="description" content="${esc(h.description)}" />`,
    `<link rel="canonical" href="${h.url}" />`,
    `<meta property="og:type" content="${h.type}" />`,
    `<meta property="og:site_name" content="${esc(site.name)}" />`,
    `<meta property="og:title" content="${esc(h.title)}" />`,
    `<meta property="og:description" content="${esc(h.description)}" />`,
    `<meta property="og:url" content="${h.url}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="675" />`,
    `<meta property="og:image:alt" content="${esc(`${site.name} — ${site.tagline}`)}" />`,
    `<meta property="og:locale" content="en_CA" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(h.title)}" />`,
    `<meta name="twitter:description" content="${esc(h.description)}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    `<script type="application/ld+json">${ld}</script>`,
  ].join("\n    ");
}

/** Keeps title/description/canonical in sync during client-side navigation. */
export function syncHead(route: Route) {
  const h = getHead(route);
  document.title = h.title;
  const set = (selector: string, attr: string, value: string) =>
    document.head.querySelector(selector)?.setAttribute(attr, value);
  set('meta[name="description"]', "content", h.description);
  set('link[rel="canonical"]', "href", h.url);
  set('meta[property="og:title"]', "content", h.title);
  set('meta[property="og:description"]', "content", h.description);
  set('meta[property="og:url"]', "content", h.url);
  set('meta[property="og:type"]', "content", h.type);
  set('meta[name="twitter:title"]', "content", h.title);
  set('meta[name="twitter:description"]', "content", h.description);
}
