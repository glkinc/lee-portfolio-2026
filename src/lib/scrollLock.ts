/**
 * Locks page scrolling behind overlays. The page's scrollbar is removed and
 * its width is added back as padding, so content doesn't shift and the
 * overlay's own scrollbar is the only one on screen.
 */
let locks = 0;

export function lockScroll() {
  if (locks++ > 0) return;
  const html = document.documentElement;
  const scrollbar = window.innerWidth - html.clientWidth;
  html.style.overflow = "hidden";
  if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
}

export function unlockScroll() {
  if (--locks > 0) return;
  locks = 0;
  document.documentElement.style.overflow = "";
  document.body.style.paddingRight = "";
}
