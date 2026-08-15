import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(cleanup);

const storage = new Map<string, string>();
Object.defineProperty(globalThis, "localStorage", {
  configurable: true,
  value: {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => storage.set(key, value),
    removeItem: (key: string) => storage.delete(key),
    clear: () => storage.clear(),
    key: (index: number) => [...storage.keys()][index] ?? null,
    get length() {
      return storage.size;
    },
  },
});

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    addListener: () => undefined,
    removeListener: () => undefined,
    dispatchEvent: () => false,
  }),
});

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
Object.defineProperty(window, "ResizeObserver", {
  writable: true,
  value: ResizeObserverMock,
});

class IntersectionObserverMock {
  readonly root = null;
  readonly rootMargin = "";
  readonly thresholds = [];
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}
Object.defineProperty(window, "IntersectionObserver", {
  writable: true,
  value: IntersectionObserverMock,
});

Object.defineProperty(Element.prototype, "scrollIntoView", {
  writable: true,
  value: () => undefined,
});

// Elements are laid out 10,000px below the viewport so DeferredRender's
// scroll fallback (which activates when the marker's rect enters the band
// around the viewport) can never fire in tests. That keeps the lazy
// ComponentCatalog and ChartGallery trees in their fallback state: they never
// mount, so react-resizable-panels never attaches its document-level
// pointerdown listener whose hit-test, under jsdom's zero layout, matches on
// every click and can steal focus from an input mid-typing. Tests that need
// the catalog or charts render those components directly instead. Width and
// height stay the same so drag math and panel layout are unaffected.
Object.defineProperty(Element.prototype, "getBoundingClientRect", {
  writable: true,
  value: () => ({
    x: 0,
    y: 10000,
    top: 10000,
    left: 0,
    right: 400,
    bottom: 10252,
    width: 400,
    height: 252,
    toJSON: () => ({}),
  }),
});

Object.defineProperty(Element.prototype, "hasPointerCapture", {
  writable: true,
  value: () => false,
});
Object.defineProperty(Element.prototype, "setPointerCapture", {
  writable: true,
  value: () => undefined,
});
Object.defineProperty(Element.prototype, "releasePointerCapture", {
  writable: true,
  value: () => undefined,
});
