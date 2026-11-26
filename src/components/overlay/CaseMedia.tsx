import { BauhausTile } from "../bauhaus/BauhausTile";
import type { CaseImage } from "../../data/caseStudies";

/**
 * Case study image. Until real imagery is supplied (`src`), renders the
 * Figma placeholder: subtle background, a Bauhaus tile and the target size.
 */
export function CaseMedia({ image, className = "", eager = false }: { image: CaseImage; className?: string; eager?: boolean }) {
  if (image.src) {
    return (
      <img
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        className={`size-full object-cover ${className}`}
      />
    );
  }
  if (image.note) {
    // Placeholder with a to-do for what image should go here.
    return (
      <div
        role="img"
        aria-label={`${image.alt} (image coming soon)`}
        className={`flex size-full flex-col justify-center gap-3 border border-dashed border-border-default bg-bg-subtle p-6 text-left lg:p-10 ${className}`}
      >
        <span className="flex items-center gap-3">
          <span className="size-8 shrink-0 lg:size-10">
            <BauhausTile {...image.tile} />
          </span>
          <span aria-hidden="true" className="label-md text-text-secondary">
            Image to add · {image.width} × {image.height}
          </span>
        </span>
        <p aria-hidden="true" className="body-md text-text-primary">
          <strong className="font-semibold">Ideal: </strong>
          {image.note.ideal}
        </p>
        <p aria-hidden="true" className="body-md text-text-secondary">
          <strong className="font-semibold">Simpler fallback: </strong>
          {image.note.fallback}
        </p>
      </div>
    );
  }
  return (
    <div
      role="img"
      aria-label={`${image.alt} (image coming soon)`}
      className={`flex size-full flex-col items-center justify-center gap-4 border border-border-default bg-bg-subtle ${className}`}
    >
      <span className="size-16 lg:size-20">
        <BauhausTile {...image.tile} />
      </span>
      <span aria-hidden="true" className="body-sm text-text-secondary">
        Image placeholder · {image.width} × {image.height}
      </span>
    </div>
  );
}
