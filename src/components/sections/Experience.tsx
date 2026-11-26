import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";
import { TileCluster } from "../bauhaus/TileCluster";
import { experience, skills } from "../../data/site";
import { experienceTiles } from "../../data/tiles";

const ease = [0.16, 1, 0.3, 1] as const;

/** Re-plays every time the block re-enters the viewport (resets on leave). */
function InView({ children, className, delay = 0, as = "div" }: { children: ReactNode; className?: string; delay?: number; as?: "div" | "li" }) {
  const reduce = useReducedMotion();
  const variants: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 32 },
    shown: { opacity: 1, y: 0, transition: { duration: 0.7, ease, delay } },
  };
  const Comp = as === "li" ? motion.li : motion.div;
  return (
    <Comp
      className={`reveal ${className ?? ""}`}
      variants={variants}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: false, amount: 0.25 }}
    >
      {children}
    </Comp>
  );
}

export function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-title" className="bg-bg-page">
      <div className="mx-auto flex w-full max-w-[1328px] flex-col gap-12 px-6 py-16 lg:gap-16 lg:py-20">
        {/* Heading with the 2 × 2 tile mark beside it (hidden on phones). */}
        <div className="flex items-center gap-12">
          <div className="hidden shrink-0 md:block">
            <TileCluster tiles={experienceTiles} size="80px" />
          </div>
          <InView className="flex max-w-[612px] flex-col gap-4">
            <h2 id="experience-title" className="heading-xs text-text-accent">
              Experience
            </h2>
            <p className="heading-lg">Multi-disciplinary product designer</p>
            <p className="body-lg">
              Designer focused on design systems and scalable digital products, with front end experience that helps
              bridge design and engineering.
            </p>
          </InView>
        </div>

        <div className="flex flex-col gap-6">
          <InView>
            <h3 className="heading-md">Professional experience</h3>
          </InView>
          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {experience.map((job, i) => (
              <InView
                as="li"
                key={job.company}
                delay={(i % 3) * 0.08}
                className="flex flex-col justify-center gap-2 border border-border-default bg-bg-page p-6"
              >
                {/* The card shows the logo only, so its alt text names the company. */}
                <div className="flex h-[60px] w-[145px] items-center">
                  <img
                    src={job.logo.src}
                    alt={job.logo.alt}
                    width={job.logo.width}
                    height={job.logo.height}
                    loading="lazy"
                    decoding="async"
                    className="max-w-none"
                    // Some logos are capped (50px) inside the 60px-tall box.
                    style={"maxHeight" in job.logo ? { maxHeight: job.logo.maxHeight, height: job.logo.maxHeight, width: "auto" } : undefined}
                  />
                </div>
                <div className="flex flex-col gap-0.5">
                  <h4 className="label-md">{job.role}</h4>
                  <p className="body-md">{job.dates}</p>
                  <p className="body-md">{job.location}</p>
                </div>
              </InView>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-6">
          <InView>
            <h3 className="heading-md">Skills</h3>
          </InView>
          <ul className="grid gap-x-8 gap-y-12 md:grid-cols-2">
            {skills.map((s, i) => (
              <InView as="li" key={s.title} delay={(i % 2) * 0.08} className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <img src={s.icon} alt="" width={24} height={24} className="size-6" />
                  <h4 className="heading-sm">{s.title}</h4>
                </div>
                <p className="body-md">{s.body}</p>
              </InView>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
