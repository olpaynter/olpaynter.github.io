"use client";

import { useEffect, useState } from "react";

const THEMES = ["warm", "typographic"] as const;

/**
 * Swaps between the two colour schemes in development. In a production build it is an empty
 * component, so the switcher code is dropped from the published site. The choice is written where the theme script reads it, so it
 * holds across pages and reloads for the rest of the session.
 */
function Switcher() {
  const [theme, setTheme] = useState<string | undefined>();

  useEffect(() => {
    const frame = requestAnimationFrame(() => setTheme(document.documentElement.dataset.theme));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!theme) return;
    document.documentElement.dataset.theme = theme;
    sessionStorage.setItem("theme", theme);
  }, [theme]);

  const choose = setTheme;

  return (
    <div className="fixed right-4 bottom-4 z-40 flex items-center gap-1 rounded-full border border-white/10 bg-background/90 p-1 text-xs backdrop-blur">
      <span className="px-2 text-muted">Dev</span>
      {THEMES.map((id) => (
        <button
          key={id}
          type="button"
          onClick={() => choose(id)}
          className={`rounded-full px-3 py-1.5 capitalize transition-colors ${
            theme === id ? "bg-white/15 text-foreground" : "text-muted hover:text-foreground"
          }`}
        >
          {id}
        </button>
      ))}
    </div>
  );
}

export const DevThemeSwitcher = process.env.NODE_ENV === "development" ? Switcher : () => null;
