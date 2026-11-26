import pricelineLogo from "../assets/logos/priceline.png";
import bmoLogo from "../assets/logos/bmo.svg";
import airmilesLogo from "../assets/logos/airmiles.svg";
import porterLogo from "../assets/logos/porter.svg";
import georgeBrownLogo from "../assets/logos/george-brown.svg";
import glkLogo from "../assets/logos/glk.svg";
import iconVisibility from "../assets/icons/visibility.svg";
import iconSparkle from "../assets/icons/temp-preferences-custom.svg";
import iconFlag from "../assets/icons/flag.svg";
import iconCode from "../assets/icons/code-blocks.svg";
import iconDesign from "../assets/icons/design-services.svg";
import iconDiamond from "../assets/icons/diamond.svg";

/** Canonical origin used for SEO tags. Override with VITE_SITE_URL. */
export const SITE_URL = (import.meta.env.VITE_SITE_URL ?? "https://leetravaglini.com").replace(/\/$/, "");

export const site = {
  name: "Lee Travaglini",
  title: "Lee Travaglini — Product Designer, Toronto",
  description:
    "Lee Travaglini is a Toronto product designer and creative generalist specialising in design systems, UX/UI, illustration and front-end development.",
  tagline: "A multi-faceted designer and engineer",
  intro:
    "I’m a product designer, front-end developer and creative generalist in Toronto, Canada. I’ve spent over ten years in design systems, graphic design, illustration and code, and I now design and build with or without AI agents.",
  email: "lee@glkinc.com",
  location: "Toronto, Canada",
  ogImage: "/og-image.png",
  social: {
    linkedin: "https://www.linkedin.com/in/lee-travaglini-30134a73/",
    medium: "https://glklee.medium.com/",
    dribbble: "https://dribbble.com/glklee",
  },
  studio: { name: "Good Lookin Kids inc.", url: "https://glkinc.com" },
};

export const sections = [
  { id: "case-studies", label: "Case Studies", menuLabel: "Case studies", accent: "blue" },
  { id: "about", label: "About", menuLabel: "About", accent: "red" },
  { id: "experience", label: "Experience", menuLabel: "Experience", accent: "yellow" },
  { id: "contact", label: "Contact", menuLabel: "Contact", accent: "dark" },
] as const;
export type SectionId = (typeof sections)[number]["id"];

/**
 * Work history. The cards show only the company's logo (no name), so every
 * logo's `alt` carries the company name; the full names also feed the JSON-LD
 * and llms.txt.
 */
export const experience = [
  {
    company: "Priceline",
    role: "Senior Product Designer",
    dates: "May 2026 - Present",
    start: "2026-05",
    location: "Toronto, Canada",
    logo: { src: pricelineLogo, width: 144, height: 60, alt: "Priceline" },
  },
  {
    company: "Bank of Montreal",
    role: "Principal UI Designer",
    dates: "June 2023 - May 2026",
    start: "2023-06",
    location: "Toronto, Canada",
    logo: { src: bmoLogo, width: 100, height: 34, alt: "BMO (Bank of Montreal)" },
  },
  {
    company: "Air Miles",
    role: "Senior UI Designer",
    dates: "January 2023 - June 2023",
    start: "2023-01",
    location: "Toronto, Canada",
    logo: { src: airmilesLogo, width: 58, height: 50, alt: "Air Miles" },
  },
  {
    company: "Porter Airlines",
    role: "Senior UI Designer",
    dates: "April 2022 - January 2023",
    start: "2022-04",
    location: "Toronto, Canada",
    logo: { src: porterLogo, width: 145, height: 60, alt: "Porter Airlines" },
  },
  {
    company: "George Brown College",
    role: "UX/UI Instructor",
    dates: "October 2021 - December 2022",
    start: "2021-10",
    location: "Toronto, Canada",
    logo: { src: georgeBrownLogo, width: 145, height: 60, alt: "George Brown College", maxHeight: 50 },
  },
  {
    company: "Good Lookin Kids Inc.",
    role: "Co-founder / Designer",
    dates: "Founded 2012",
    start: "2012",
    location: "Toronto, Canada",
    logo: { src: glkLogo, width: 145, height: 60, alt: "Good Lookin Kids", maxHeight: 50 },
  },
];

export const skills = [
  {
    title: "UX/UI design",
    icon: iconVisibility,
    body: "Designing accessible, adaptive interfaces in Figma and Claude, with rapid prototyping and user testing to validate ideas early.",
  },
  {
    title: "Design Systems",
    icon: iconSparkle,
    body: "Building component libraries with Storybook documentation, usage guidelines and MCP markdown setups so designers, developers and LLMs share one source.",
  },
  {
    title: "Leadership & strategy",
    icon: iconFlag,
    body: "Mentoring designers and leading work across design, development and product, from UX consultation and client workshops to creative campaigns.",
  },
  {
    title: "Engineering",
    icon: iconCode,
    body: "Building responsive, accessible front ends with HTML5, CSS3, JavaScript, React, React Native and WordPress, including CSS and SVG animation.",
  },
  {
    title: "Visual & graphic design",
    icon: iconDesign,
    body: "Creating branding, illustration and iconography with Photoshop and Illustrator, plus marketing collateral and social media design.",
  },
  {
    title: "Creative direction",
    icon: iconDiamond,
    body: "Leading teams to align vision, strategy and aesthetics across branding and marketing for clear, impactful visual communication.",
  },
];
