export function waitForDemo(duration = 750) {
  return new Promise<void>((resolve) => window.setTimeout(resolve, duration));
}
