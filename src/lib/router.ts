import { useCallback, useEffect, useState } from "react";
import { caseStudyPath, getCaseStudy } from "../data/caseStudies";

/**
 * Minimal history-based routing. The site is a single page; each case study
 * also has its own crawlable URL (/case-studies/<slug>/) that opens it as an
 * overlay on top of the home page and is prerendered as static HTML.
 */
export type Route = { name: "home" } | { name: "case-study"; slug: string };

export function parseRoute(pathname: string): Route {
  const m = pathname.match(/^\/case-studies\/([a-z0-9-]+)\/?$/);
  if (m && getCaseStudy(m[1])) return { name: "case-study", slug: m[1] };
  return { name: "home" };
}

export const routePath = (r: Route) => (r.name === "case-study" ? caseStudyPath(r.slug) : "/");

export function useRouter(initial: Route) {
  const [route, setRoute] = useState<Route>(initial);

  useEffect(() => {
    const onPop = () => setRoute(parseRoute(window.location.pathname));
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const navigate = useCallback((next: Route, { replace = false } = {}) => {
    const path = routePath(next);
    if (path !== window.location.pathname) {
      const hash = next.name === "home" ? window.location.hash : "";
      window.history[replace ? "replaceState" : "pushState"]({}, "", path + hash);
    }
    setRoute(next);
  }, []);

  return { route, navigate };
}
