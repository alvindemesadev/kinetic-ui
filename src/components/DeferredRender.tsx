import { useEffect, useRef, useState, type ReactNode } from "react";

type DeferredRenderProps = {
  children: ReactNode;
  fallback: ReactNode;
  /** Start loading shortly before the section enters the viewport. */
  rootMargin?: string;
};

/**
 * Defers expensive demo trees until they are close to the viewport.
 *
 * The SSR/test fallback is intentionally eager when IntersectionObserver is
 * unavailable, so consumers never lose content in non-browser environments.
 */
export function DeferredRender({ children, fallback, rootMargin = "720px 0px" }: DeferredRenderProps) {
  const [ready, setReady] = useState(() => typeof IntersectionObserver === "undefined");
  const markerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") {
      return;
    }

    const marker = markerRef.current;
    if (!marker) return;

    const activateIfNear = () => {
      const bounds = marker.getBoundingClientRect();
      if (bounds.top < window.innerHeight + 960 && bounds.bottom > -960) {
        setReady(true);
        observer.disconnect();
        window.removeEventListener("scroll", activateIfNear);
        window.removeEventListener("resize", activateIfNear);
      }
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setReady(true);
        observer.disconnect();
        window.removeEventListener("scroll", activateIfNear);
        window.removeEventListener("resize", activateIfNear);
      },
      { rootMargin },
    );
    observer.observe(marker);
    window.addEventListener("scroll", activateIfNear, { passive: true });
    window.addEventListener("resize", activateIfNear);
    activateIfNear();
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", activateIfNear);
      window.removeEventListener("resize", activateIfNear);
    };
  }, [rootMargin]);

  return <div ref={markerRef}>{ready ? children : fallback}</div>;
}
