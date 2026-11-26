import { AnimatePresence, motion, useReducedMotion, type Variants } from "motion/react";
import { useEffect, useRef, type MouseEvent, type ReactNode } from "react";
import { Button, Pill } from "../ui/Button";
import { CloseButton } from "../ui/CloseButton";
import { CaseMedia } from "./CaseMedia";
import { caseStudyPath, getCaseStudy, nextCaseStudy, type CaseImage, type CaseStudy } from "../../data/caseStudies";
import { withBase } from "../../lib/base";

const ease = [0.16, 1, 0.3, 1] as const;

/** Same content width as the rest of the site (1280px inside 24px gutters). */
const WIDTH = "mx-auto w-full max-w-[1328px] px-6";

interface Props {
  slug: string;
  onClose: () => void;
  onNext: (slug: string) => void;
}

/**
 * Case study overlay — a modal dialog over the home page with a sticky header.
 * Content builds in with staggered rises; images animate up as they enter.
 */
export function CaseStudyOverlay({ slug, onClose, onNext }: Props) {
  const cs = getCaseStudy(slug)!;
  const scroller = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    closeRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // New case study (via "next"): start from the top.
  useEffect(() => {
    scroller.current?.scrollTo({ top: 0 });
  }, [slug]);

  const next = nextCaseStudy(slug);
  const goNext = (e: MouseEvent) => {
    if (e.metaKey || e.ctrlKey) return;
    e.preventDefault();
    onNext(next.slug);
  };

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="fixed inset-0 z-[60] bg-bg-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.35, delay: 0.05 } }}
        transition={{ duration: 0.4 }}
      />
      <motion.div
        ref={scroller}
        role="dialog"
        aria-modal="true"
        aria-labelledby="case-study-title"
        className="fixed inset-0 z-[61] overflow-y-auto overscroll-contain"
        exit={{ opacity: 0, transition: { duration: 0.3, ease: "easeOut" } }}
      >
        <motion.header
          className="sticky top-0 z-10 border-b border-border-default bg-bg-page"
          initial={{ y: reduce ? 0 : "-100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: reduce ? 0 : "-100%", opacity: 0 }}
          transition={{ duration: 0.5, ease, delay: 0.15 }}
        >
          <div className={`${WIDTH} flex items-center justify-between py-2 lg:py-6`}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={cs.slug}
              className={`flex items-center ${cs.logo.headerClass ?? "h-8 lg:h-10"}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <img
                src={cs.logo.src}
                alt={cs.logo.alt}
                width={cs.logo.width}
                height={cs.logo.height}
                className="h-full w-auto"
              />
            </motion.div>
          </AnimatePresence>
          <CloseButton ref={closeRef} onClick={onClose} label={`Close ${cs.name} case study`} />
          </div>
        </motion.header>

        <AnimatePresence mode="wait" initial={false}>
          <CaseStudyBody key={cs.slug} cs={cs} reduce={!!reduce} />
        </AnimatePresence>

        <motion.section
          aria-labelledby="next-case-study"
          className="bg-bg-page"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className={`${WIDTH} flex flex-col items-start gap-6 py-16 md:flex-row md:items-center md:justify-between lg:py-24`}>
          <div className="flex flex-col gap-2">
            <p className="body-md text-text-muted-dark">Next case study</p>
            <h2 id="next-case-study" className={`flex items-center ${next.logo.nextClass ?? "h-12 lg:h-16"}`}>
              <img
                src={next.logo.src}
                alt={next.logo.alt}
                width={next.logo.width}
                height={next.logo.height}
                loading="lazy"
                className="h-full w-auto"
              />
            </h2>
          </div>
          <Button href={withBase(caseStudyPath(next.slug))} onClick={goNext}>
            {`View ${next.name} case study`}
          </Button>
          </div>
        </motion.section>
      </motion.div>
    </>
  );
}

function CaseStudyBody({ cs, reduce }: { cs: CaseStudy; reduce: boolean }) {
  const container: Variants = {
    hidden: {},
    shown: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };

  return (
    <motion.article aria-labelledby="case-study-title" variants={container} initial="hidden" animate="shown" exit="exit">
      <div className={`${WIDTH} flex flex-col gap-16 pt-8 pb-16 lg:gap-24 lg:pt-12 lg:pb-24`}>
        {/* Hero */}
        <div className="flex flex-col gap-6 lg:gap-8">
          <Rise reduce={reduce}>
            <Pill icon={cs.icon} label={cs.category} size="md" />
          </Rise>
          <Rise reduce={reduce}>
            <h1 id="case-study-title" className="heading-lg max-w-[960px]">
              {cs.title}
            </h1>
          </Rise>
          <Rise reduce={reduce}>
            <p className="body-xl max-w-[840px] text-text-secondary">{cs.intro}</p>
          </Rise>
          {cs.link && (
            <Rise reduce={reduce}>
              <a
                href={cs.link.href}
                target="_blank"
                rel="noopener"
                className="label-md inline-flex items-center gap-2 text-text-interactive underline-offset-4 hover:underline"
              >
                {cs.link.label}
                <span aria-hidden="true">↗</span>
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </Rise>
          )}
          <Rise reduce={reduce}>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-4 border-t border-border-default pt-6 lg:grid-cols-4 lg:gap-10">
              {cs.meta.map((m) => (
                <div key={m.label} className="flex flex-col gap-1">
                  <dt className="body-sm text-text-muted-dark">{m.label}</dt>
                  <dd className="label-md">{m.value}</dd>
                </div>
              ))}
            </dl>
          </Rise>
          <RiseImage image={cs.heroImage} bordered={cs.imageBorder} natural eager reduce={reduce} />

          {/* Highlights */}
          <section aria-labelledby="highlights-title" className="grid gap-8 md:grid-cols-3">
            <h2 id="highlights-title" className="sr-only">
              Highlights
            </h2>
            {cs.highlights.map((h) => (
              <Rise key={h.title} reduce={reduce} className="flex flex-col gap-3">
                <h3 className="heading-sm text-text-primary">{h.title}</h3>
                <p className="body-md text-text-primary">{h.body}</p>
              </Rise>
            ))}
          </section>
        </div>

        <Row title="Overview" reduce={reduce}>
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <h3 className="heading-xs">The challenge</h3>
              <p className="body-lg text-text-secondary">{cs.overview.challenge}</p>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="heading-xs">My role</h3>
              <p className="body-lg text-text-secondary">{cs.overview.role}</p>
            </div>
          </div>
        </Row>

        <Row title="Approach" subtitle={cs.approach.intro} reduce={reduce}>
          <ol className="flex flex-col gap-8">
            {cs.approach.steps.map((s, i) => (
              <li key={s.title} className="flex gap-6">
                <span aria-hidden="true" className="heading-md w-12 shrink-0 text-text-accent lg:w-[72px]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex flex-col gap-2">
                  <h3 className="heading-xs">{s.title}</h3>
                  <p className="body-lg text-text-secondary">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </Row>

        {/* Approach images — swipeable with a peek of the next on mobile */}
        {cs.approach.images && (
        <div
          role="region"
          aria-label="Approach images"
          tabIndex={0}
          className="no-scrollbar -mx-6 flex snap-x snap-mandatory scroll-px-6 gap-4 overflow-x-auto px-6 md:mx-0 md:grid md:grid-cols-2 md:items-start md:gap-6 md:overflow-visible md:px-0"
        >
          {cs.approach.images.map((image, i) => (
            <RiseImage
              key={i}
              image={image}
              delay={i * 0.1}
              reduce={reduce}
              natural={!!image.natural}
              bordered={cs.imageBorder}
              className={`${image.note && !image.src ? "md:aspect-[628/420]" : "aspect-[628/420]"} w-[85%] shrink-0 snap-start md:w-auto`}
            />
          ))}
        </div>
        )}

        {cs.features.map((f) => (
          <div key={f.title} className="flex flex-col gap-16 lg:gap-24">
            <Row title={f.title} reduce={reduce}>
              <div className="flex flex-col gap-4">
                <p className="body-lg text-text-secondary">{f.body}</p>
                {f.link && (
                  <a
                    href={f.link.href}
                    target="_blank"
                    rel="noopener"
                    className="label-md inline-flex items-center gap-2 self-start text-text-interactive underline-offset-4 hover:underline"
                  >
                    {f.link.label}
                    <span aria-hidden="true">↗</span>
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                )}
              </div>
            </Row>
            {f.gallery ? (
              <div
                className={
                  f.layout === "cards"
                    ? "grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4"
                    : f.layout === "pictographs"
                    ? "grid grid-cols-2 gap-3 md:grid-cols-6 md:gap-6"
                    : f.layout === "grid"
                    ? "grid gap-4 md:grid-cols-2 md:gap-6"
                    : f.layout === "trio"
                      ? "grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-6"
                    : f.layout === "pair"
                      ? "mx-auto grid w-full max-w-[640px] grid-cols-2 items-start gap-4 md:gap-6"
                      : f.layout === "sidecar"
                        ? "grid items-start gap-4 md:grid-cols-[minmax(0,300px)_1fr] md:gap-6"
                        : f.layout === "narrow"
                          ? "mx-auto flex w-full max-w-[720px] flex-col gap-4"
                          : "flex flex-col gap-4 md:gap-6"
                }
              >
                {f.gallery.map((image, i) => f.layout === "pictographs" ? (
                  <PictographTile key={i} image={image} index={i} reduce={reduce} />
                ) : (
                  <RiseImage key={i} image={image} reduce={reduce} delay={(i % 2) * 0.1} natural bordered={cs.imageBorder} />
                ))}
              </div>
            ) : (
              <RiseImage image={f.image} bordered={cs.imageBorder} reduce={reduce} className="aspect-[4/3] md:aspect-[1280/560]" />
            )}
          </div>
        ))}

        <Row title="Skills and tools" reduce={reduce}>
          <ul className="flex flex-wrap gap-3">
            {cs.skills.map((s) => (
              <li
                key={s}
                className="body-md rounded-full bg-bg-subtle px-4 py-2"
              >
                {s}
              </li>
            ))}
          </ul>
        </Row>
      </div>

      {/* Outcome */}
      <section aria-labelledby="outcome-title" className="bg-bg-dark text-text-inverse">
        <div className={`${WIDTH} flex flex-col gap-4 py-16 lg:flex-row lg:gap-10 lg:py-20`}>
          <h2 id="outcome-title" className="heading-md lg:w-[400px] lg:shrink-0">
            Outcome
          </h2>
          <p className="heading-sm">{cs.outcome}</p>
        </div>
      </section>
    </motion.article>
  );
}

function Rise({ children, className, reduce }: { children: ReactNode; className?: string; reduce: boolean }) {
  return (
    <motion.div
      className={`reveal ${className ?? ""}`}
      variants={{
        hidden: { opacity: 0, y: reduce ? 0 : 24 },
        shown: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
      }}
    >
      {children}
    </motion.div>
  );
}

/** Image that animates up as it scrolls into view. */
function RiseImage({
  image,
  className,
  reduce,
  delay = 0,
  eager = false,
  natural = false,
  bordered = false,
}: {
  image: CaseImage;
  className?: string;
  reduce: boolean;
  delay?: number;
  eager?: boolean;
  /** Use the image's own aspect ratio (screenshots) instead of a fixed crop. */
  natural?: boolean;
  /** Draw a hairline border (for screenshots that sit white on white). */
  bordered?: boolean;
}) {
  return (
    <motion.div
      className={`reveal relative ${image.note && !image.src ? "" : "overflow-hidden"} ${bordered || image.bordered ? "border border-border-default" : ""} ${className ?? ""}`}
      style={
        natural
          ? {
              aspectRatio: `${image.width} / ${image.height}`,
              ...(image.displayWidth ? { maxWidth: image.displayWidth, marginInline: "auto" } : null),
            }
          : undefined
      }
      initial={{ opacity: 0, y: reduce ? 0 : 64 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.9, ease, delay: delay + (eager ? 0.35 : 0) }}
    >
      <CaseMedia image={image} eager={eager} />
    </motion.div>
  );
}

/** Animated pictograph on a coloured tile: three across, then two wider. */
function PictographTile({ image, index, reduce }: { image: CaseImage; index: number; reduce: boolean }) {
  const span =
    index < 3
      ? "aspect-square md:col-span-2"
      : index === 3
        ? "aspect-square md:col-span-3 md:aspect-[3/2]"
        : "col-span-2 aspect-[2/1] md:col-span-3 md:aspect-[3/2]";
  return (
    <motion.div
      className={`reveal relative flex items-center justify-center overflow-hidden rounded-2xl ${image.bg ?? "bg-bg-subtle"} ${span}`}
      initial={{ opacity: 0, y: reduce ? 0 : 48, scale: reduce ? 1 : 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease, delay: (index % 3) * 0.1 }}
    >
      <picture className="contents">
        {image.staticSrc && <source media="(prefers-reduced-motion: reduce)" srcSet={image.staticSrc} />}
        <img
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          loading="lazy"
          decoding="async"
          className="h-[80%] w-[80%] object-contain"
        />
      </picture>
    </motion.div>
  );
}

function Row({ title, subtitle, children, reduce }: { title: string; subtitle?: string; children: ReactNode; reduce: boolean }) {
  return (
    <motion.section
      className="reveal flex flex-col gap-6 border-t border-border-default pt-12 lg:flex-row lg:gap-10"
      initial={{ opacity: 0, y: reduce ? 0 : 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease }}
    >
      <div className="flex flex-col gap-3 lg:w-[400px] lg:shrink-0">
        <h2 className="heading-md">{title}</h2>
        {subtitle && <p className="body-md text-text-muted-dark">{subtitle}</p>}
      </div>
      <div className="flex-1">{children}</div>
    </motion.section>
  );
}
