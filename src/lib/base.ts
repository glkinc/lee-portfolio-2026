/**
 * The site can be served from a sub-path (e.g. GitHub Pages at
 * /lee-portfolio-2026/). Routes are kept root-relative ("/case-studies/x/")
 * everywhere in the app; these helpers add or strip the deploy base only at
 * the edges where a real URL is read or written.
 */
const BASE = import.meta.env.BASE_URL.replace(/\/$/, ""); // "" or "/lee-portfolio-2026"

/** "/case-studies/x/" -> "/lee-portfolio-2026/case-studies/x/" */
export const withBase = (path: string) => `${BASE}${path}`;

/** "/lee-portfolio-2026/case-studies/x/" -> "/case-studies/x/" */
export const stripBase = (pathname: string) =>
  BASE && pathname.startsWith(BASE) ? pathname.slice(BASE.length) || "/" : pathname;
