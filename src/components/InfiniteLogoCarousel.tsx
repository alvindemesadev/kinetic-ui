import { useState, type CSSProperties } from "react";
import { Pause, Play } from "lucide-react";
import type { SimpleIcon } from "simple-icons";

import { cn } from "@/lib/utils";

export type InfiniteLogoCarouselItem = {
  name: string;
  icon?: SimpleIcon;
  imageSrc?: string;
  href?: string;
};

export type InfiniteLogoCarouselProps = {
  items: InfiniteLogoCarouselItem[];
  ariaLabel?: string;
  className?: string;
  direction?: "left" | "right";
  duration?: number;
  pauseOnHover?: boolean;
  showPauseControl?: boolean;
};

type CarouselStyle = CSSProperties & {
  "--logo-carousel-duration": string;
};

function LogoArtwork({ item }: { item: InfiniteLogoCarouselItem }) {
  if (item.imageSrc) {
    return <img src={item.imageSrc} alt="" loading="lazy" draggable={false} />;
  }

  if (item.icon) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d={item.icon.path} />
      </svg>
    );
  }

  return <span aria-hidden="true">{item.name.slice(0, 2).toUpperCase()}</span>;
}

function LogoGroup({ items, duplicate = false }: { items: InfiniteLogoCarouselItem[]; duplicate?: boolean }) {
  return (
    <div
      className="infinite-logo-group"
      role={duplicate ? undefined : "list"}
      aria-hidden={duplicate || undefined}
    >
      {items.map((item, index) => {
        const content = (
          <>
            <span
              className="infinite-logo-mark"
              style={item.icon ? ({ "--logo-brand": `#${item.icon.hex}` } as CSSProperties) : undefined}
            >
              <LogoArtwork item={item} />
            </span>
            <span className="infinite-logo-name">{item.name}</span>
          </>
        );

        return item.href && !duplicate ? (
          <a
            className="infinite-logo-item"
            href={item.href}
            target="_blank"
            rel="noreferrer"
            role="listitem"
            key={`${item.name}-${index}`}
          >
            {content}
          </a>
        ) : (
          <div
            className="infinite-logo-item"
            role={duplicate ? undefined : "listitem"}
            key={`${item.name}-${index}`}
          >
            {content}
          </div>
        );
      })}
    </div>
  );
}

export function InfiniteLogoCarousel({
  items,
  ariaLabel = "Featured technologies",
  className,
  direction = "left",
  duration = 32,
  pauseOnHover = true,
  showPauseControl = true,
}: InfiniteLogoCarouselProps) {
  const [paused, setPaused] = useState(false);
  const safeDuration = Math.max(8, duration);
  const style: CarouselStyle = { "--logo-carousel-duration": `${safeDuration}s` };

  if (items.length === 0) return null;

  return (
    <div
      className={cn(
        "infinite-logo-carousel",
        direction === "right" && "moves-right",
        pauseOnHover && "pauses-on-interaction",
        paused && "is-paused",
        className,
      )}
      style={style}
      role="region"
      aria-label={ariaLabel}
    >
      <div className="infinite-logo-viewport">
        <div className="infinite-logo-track">
          <LogoGroup items={items} />
          <LogoGroup items={items} duplicate />
        </div>
      </div>
      {showPauseControl ? (
        <button
          className="infinite-logo-pause"
          type="button"
          aria-label={paused ? "Resume logos" : "Pause logos"}
          aria-pressed={paused}
          onClick={() => setPaused((value) => !value)}
        >
          <span className={`infinite-logo-pause-icon ${paused ? "is-play" : "is-pause"}`} aria-hidden="true">
            {paused ? <Play /> : <Pause />}
          </span>
          <span className="infinite-logo-pause-label">{paused ? "Resume logos" : "Pause logos"}</span>
        </button>
      ) : null}
    </div>
  );
}
