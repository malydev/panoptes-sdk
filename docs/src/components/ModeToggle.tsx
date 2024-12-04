import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "./icons";

export function ModeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = saved ? saved === "dark" : prefersDark;
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggle = () => {
    setDark((prev) => {
      const next = !prev;
      if (typeof document !== "undefined") {
        document.documentElement.classList.toggle("dark", next);
        localStorage.setItem("theme", next ? "dark" : "light");
      }
      return next;
    });
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-2 text-xs font-semibold text-white backdrop-blur transition hover:border-white/50 hover:bg-white/20 sm:px-4 sm:text-sm"
      aria-label="Toggle theme"
    >
      {dark ? <SunIcon /> : <MoonIcon />}
      <span className="uppercase">{dark ? "Light" : "Dark"}</span>
    </button>
  );
}
