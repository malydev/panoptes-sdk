import { useState } from "react";
import { LanguageToggle } from "./LanguageToggle";
import { ModeToggle } from "./ModeToggle";
import { GithubIcon } from "./icons";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Docs", href: "/docs" },
  { label: "Quick Start", href: "/quick-start" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-slate-950/70 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <a href="/" className="flex items-center gap-2 text-white">
          <span className="text-2xl">👁️</span>
          <span className="text-xl font-bold tracking-[0.2em]">PANOPTES</span>
        </a>

        <div className="hidden items-center gap-6 text-sm font-medium text-slate-200 md:flex">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="hover:text-white">
              {item.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <LanguageToggle />
          <ModeToggle />
          <a
            href="https://github.com/malydev/panoptes-sdk"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-2 text-xs font-semibold text-white backdrop-blur transition hover:border-white/50 hover:bg-white/20"
          >
            <GithubIcon />
            GitHub
          </a>
        </div>

        <button
          className="md:hidden rounded-md border border-white/30 p-2 text-white"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-slate-950/90 px-4 pb-4 md:hidden">
          <div className="flex flex-col gap-3 py-4 text-sm font-medium text-slate-200">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="hover:text-white" onClick={() => setOpen(false)}>
                {item.label}
              </a>
            ))}
            <div className="flex items-center gap-2">
              <LanguageToggle />
              <ModeToggle />
              <a
                href="https://github.com/malydev/panoptes-sdk"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-2 text-xs font-semibold text-white backdrop-blur transition hover:border-white/50 hover:bg-white/20"
              >
                <GithubIcon />
                GitHub
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
