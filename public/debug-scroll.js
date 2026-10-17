// Temporary: records what moves the page, to find a jump on Android Firefox. Loaded only after
// visiting a page with ?debug-scroll, and removed once the cause is known.
(() => {
  const KEY = "debug-scroll-log";
  const lines = JSON.parse(sessionStorage.getItem(KEY) ?? "[]");
  const t0 = Date.now();
  const panel = document.createElement("pre");
  panel.style.cssText =
    "position:fixed;left:4px;right:4px;bottom:4px;z-index:99;max-height:45vh;overflow:auto;margin:0;padding:6px;font:10px/1.3 monospace;color:#ece6dc;background:rgba(0,0,0,.85);border:1px solid #e0a458;border-radius:6px;white-space:pre-wrap;pointer-events:auto";
  const render = () => {
    panel.textContent = lines.slice(-40).join("\n");
    panel.scrollTop = panel.scrollHeight;
  };
  const log = (message) => {
    lines.push(`${String(Date.now() - t0).padStart(5)} ${message} y=${Math.round(scrollY)} h=${innerHeight} ${location.pathname}`);
    sessionStorage.setItem(KEY, JSON.stringify(lines.slice(-200)));
    render();
  };
  const caller = () =>
    (new Error().stack ?? "")
      .split("\n")
      .slice(2, 3)
      .map((line) => line.replace(/.*\/(chunks\/)?/, "").slice(0, 40))
      .join("");

  const scrollTo = window.scrollTo.bind(window);
  window.scrollTo = (...args) => {
    log(`scrollTo ${JSON.stringify(args[0])} ${caller()}`);
    return scrollTo(...args);
  };
  const scrollIntoView = Element.prototype.scrollIntoView;
  Element.prototype.scrollIntoView = function (...args) {
    log(`scrollIntoView <${this.tagName.toLowerCase()}${this.id ? "#" + this.id : ""}> ${caller()}`);
    return scrollIntoView.apply(this, args);
  };
  const scrollTop = Object.getOwnPropertyDescriptor(Element.prototype, "scrollTop");
  Object.defineProperty(Element.prototype, "scrollTop", {
    configurable: true,
    get: scrollTop.get,
    set(value) {
      if (this === document.documentElement || this === document.body) log(`scrollTop=${value} ${caller()}`);
      scrollTop.set.call(this, value);
    },
  });
  if (document.startViewTransition) {
    const start = document.startViewTransition.bind(document);
    document.startViewTransition = (...args) => {
      log("transition start");
      const transition = start(...args);
      // Ready resolves once the new page has been captured, so its y is the position the animation shows.
      transition.ready.then(() => log("transition ready"));
      transition.finished.then(() => log("transition end"));
      return transition;
    };
  }

  let lastY;
  addEventListener(
    "scroll",
    () => {
      const y = Math.round(scrollY);
      if (y !== lastY) log("scroll");
      lastY = y;
    },
    { passive: true },
  );
  addEventListener("resize", () => log("resize"));
  addEventListener(
    "load",
    (event) => {
      if (event.target instanceof HTMLImageElement) {
        log(`img ${event.target.src.split("/").pop()} top=${Math.round(event.target.getBoundingClientRect().top)}`);
      }
    },
    true,
  );
  addEventListener("focusin", (event) => log(`focus <${event.target.tagName?.toLowerCase()}>`), true);
  document.fonts?.addEventListener("loadingdone", () => log("fonts loaded"));
  // Each visit with ?debug-scroll starts a new log, with anchoring off only if &no-anchor is given.
  if (/[?&]debug-scroll/.test(location.search)) {
    lines.length = 0;
    sessionStorage.setItem("debug-no-anchor", /[?&]no-anchor/.test(location.search) ? "1" : "");
  }
  const noAnchor = sessionStorage.getItem("debug-no-anchor") === "1";
  if (noAnchor) document.documentElement.style.overflowAnchor = "none";
  addEventListener("popstate", () => log("popstate"), true);
  addEventListener("click", (event) => log(`tap ${event.target.closest?.("a")?.getAttribute("href") ?? ""}`), true);
  let path = location.pathname;
  setInterval(() => {
    if (location.pathname !== path) log(`page ${(path = location.pathname)}`);
  }, 50);

  log(
    `start ${navigator.userAgent.replace(/.*(Firefox\/[\d.]+|Chrome\/[\d.]+).*/, "$1")} navApi=${"navigation" in window} anchoring=${noAnchor ? "off" : "on"}`,
  );
  if (document.readyState === "loading") addEventListener("DOMContentLoaded", () => document.documentElement.append(panel));
  else document.documentElement.append(panel);
})();
