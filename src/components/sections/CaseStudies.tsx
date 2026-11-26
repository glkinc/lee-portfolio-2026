import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { BuildOnView } from "../bauhaus/BuildOnView";
import { AnimatedThumb } from "../ui/AnimatedThumb";
import { Button, Pill } from "../ui/Button";
import { caseStudies, caseStudyPath, type CaseStudy } from "../../data/caseStudies";
import { withBase } from "../../lib/base";
import { caseStudyTiles } from "../../data/tiles";

interface Props {
  onOpen: (slug: string, trigger: HTMLElement) => void;
}

export function CaseStudies({ onOpen }: Props) {
  const reduce = useReducedMotion();

  return (
    <section id="case-studies" aria-labelledby="case-studies-title" className="bg-bg-subtle text-text-primary">
      <div className="tile-grid mx-auto w-full max-w-[1328px] px-6 py-16 lg:py-20">
        <div className="flex items-start justify-between gap-6">
          <div className="flex max-w-[640px] flex-col gap-4">
            <h2 id="case-studies-title" className="heading-lg">
              Case studies
            </h2>
            <p className="body-md">
              Selected case studies in UX, UI and design systems for brands including Priceline and BMO (Blue Rewards). I
              design scalable, consistent product experiences, connecting strategy, interaction and visual design with
              front-end know-how.
            </p>
          </div>
          <BuildOnView tiles={caseStudyTiles} className="hidden shrink-0 lg:block" />
        </div>

        <CardStack reduce={!!reduce}>
          {caseStudies.map((cs, i) => (
            <CaseStudyCard
              key={cs.slug}
              cs={cs}
              index={i}
              total={caseStudies.length}
              onOpen={onOpen}
              stacked={!reduce}
            />
          ))}
        </CardStack>
      </div>
    </section>
  );
}

function CardStack({ children, reduce }: { children: React.ReactNode; reduce: boolean }) {
  return (
    <div
      className={reduce ? "mt-6 flex flex-col gap-6 lg:mt-20 lg:gap-20" : "relative mt-6 pb-[12vh] lg:mt-20"}
      role="list"
    >
      {children}
    </div>
  );
}

// Stacked cards stick just below the floating navigation.
const STICKY_TOP = "calc(var(--header-h) + 88px)";

function CaseStudyCard({
  cs,
  index,
  total,
  onOpen,
  stacked,
}: {
  cs: CaseStudy;
  index: number;
  total: number;
  onOpen: Props["onOpen"];
  stacked: boolean;
}) {
  const nextMarker = useRef<HTMLDivElement>(null);
  const isLast = index === total - 1;

  // Progress of the *next* card sliding up over this one: 0 when it enters
  // the bottom of the viewport, 1 when it's fully stacked on top.
  const { scrollYProgress } = useScroll({
    target: nextMarker,
    offset: ["end end", "end 120px"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.86]);
  const opacity = useTransform(scrollYProgress, [0.35, 1], [1, 0]);

  // Animated thumbnails play while the image or the CTA is hovered (or the CTA
  // is focused) and play backward to the start when it isn't. On touch screens
  // and the stacked mobile/tablet layout there's no hover, so they sit on their
  // finished frame instead.
  const thumbRef = useRef<HTMLAnchorElement>(null);
  const [thumbHover, setThumbHover] = useState(false);
  const [ctaHover, setCtaHover] = useState(false);
  const [still, setStill] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(hover: none), (width < 1024px)");
    const update = () => setStill(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  const playing = thumbHover || ctaHover;
  const hoverProps = (set: (v: boolean) => void) =>
    cs.thumb.animated ? { onPointerEnter: () => set(true), onPointerLeave: () => set(false) } : {};

  const href = withBase(caseStudyPath(cs.slug));
  const open = (e: MouseEvent<HTMLElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return; // allow new-tab
    e.preventDefault();
    onOpen(cs.slug, e.currentTarget);
  };

  const card = (
    <motion.article
      aria-labelledby={`card-${cs.slug}-title`}
      style={stacked && !isLast ? { scale, opacity, transformOrigin: "50% 0%" } : undefined}
      className="flex flex-col overflow-hidden bg-bg-page text-text-primary lg:aspect-[16/6] lg:flex-row"
    >
      {/* Thumbnail — opens the case study. */}
      <a
        href={href}
        onClick={open}
        tabIndex={-1}
        aria-hidden="true"
        ref={thumbRef}
        {...hoverProps(setThumbHover)}
        className="group relative order-first aspect-[3/2] w-full shrink-0 cursor-pointer lg:order-last lg:aspect-auto lg:w-[49.75%]"
      >
        <div
          className="absolute inset-0 overflow-hidden bg-bg-inverse"
          // Animated thumbs fill behind with their own background colour so no
          // sub-pixel sliver of the placeholder shows at the edges.
          style={cs.thumb.animated ? { backgroundColor: cs.thumb.animated.background } : undefined}
        >
            {cs.thumb.animated ? (
              <AnimatedThumb
                markup={cs.thumb.animated.markup}
                width={cs.thumb.width}
                height={cs.thumb.height}
                playing={playing}
                still={still}
                speed={cs.thumb.animated.speed}
              />
            ) : cs.thumb.src ? (
              <img
                src={cs.thumb.src}
                alt=""
                width={cs.thumb.width}
                height={cs.thumb.height}
                loading="lazy"
                decoding="async"
                className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <span className="block size-full transition-transform duration-700 group-hover:scale-105" />
            )}
        </div>
      </a>

      <div className="flex flex-1 flex-col items-start gap-4 px-6 py-8 lg:justify-between lg:gap-0 lg:py-12 lg:pr-20 lg:pl-12">
        <Pill icon={cs.icon} label={cs.category} size="md" />
        <div className="flex w-full flex-col gap-4">
          <h3 id={`card-${cs.slug}-title`} className="heading-md">
            {cs.name}
          </h3>
          <p className="body-lg">{cs.summary}</p>
          <ul className="body-sm flex flex-wrap gap-1 text-text-muted-dark" aria-label="Skills">
            {cs.cardSkills.map((s, i) => (
              <li key={s} className="flex gap-1">
                {i > 0 && <span aria-hidden="true">/</span>}
                {s}
              </li>
            ))}
          </ul>
        </div>
        <Button
          href={href}
          onClick={open}
          aria-label={`${cs.cta} — ${cs.name} case study`}
          {...hoverProps(setCtaHover)}
          {...(cs.thumb.animated ? { onFocus: () => setCtaHover(true), onBlur: () => setCtaHover(false) } : {})}
        >
          {cs.cta}
        </Button>
      </div>
    </motion.article>
  );

  if (!stacked) {
    return <div role="listitem">{card}</div>;
  }

  return (
    <>
      <div role="listitem" className="sticky" style={{ top: STICKY_TOP, zIndex: index + 1 }}>
        {card}
      </div>
      {/* Gap before the next card; its bottom edge is where the next card naturally starts. */}
      <div ref={nextMarker} aria-hidden="true" className={isLast ? "" : "h-[15vh]"} />
    </>
  );
}
