import { useEffect, useRef, useState } from "react";
import { BookIcon, GithubIcon, RayIcon, WorldIcon } from "./icons";
import { useLanguage, type Lang } from "../hooks/useLanguage";

const copy = {
  hero: {
    langLabel: { en: "Language", es: "Idioma" },
    description: {
      en: "Panoptes is the simplest way to implement complete SQL auditing in minutes: wrap DB clients, capture before/after, and ship events anywhere.",
      es: "Panoptes es la forma más simple de implementar auditoría SQL completa en minutos: envuelve clientes, captura before/after y envía eventos a cualquier destino.",
    },
    ctaDocs: { en: "View Docs", es: "Ver Docs" },
    ctaStart: { en: "Quick Start", es: "Inicio Rápido" },
  },
  footer: { author: { en: "malydev", es: "malydev" } },
  language: { english: { en: "English", es: "Inglés" }, spanish: { en: "Spanish", es: "Español" } },
};

const GITHUB_URL = "https://github.com/malydev/panoptes-sdk";
const GITHUB_URL_DOCS = "https://github.com/malydev/panoptes-sdk/tree/main/docs";

function t(obj: { en: string; es: string }, lang: Lang) {
  return obj[lang];
}

const HeroShell = () => {
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const toggleRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    setOpen(false);
  }, [lang]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!open) return;
      const menu = menuRef.current;
      const toggle = toggleRef.current;
      if (menu && menu.contains(e.target as Node)) return;
      if (toggle && toggle.contains(e.target as Node)) return;
      setOpen(false);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [open]);

  const switchLang = (code: Lang) => {
    setLang(code);
    setOpen(false);
  };

  return (
    <div className="relative z-20 flex min-h-screen w-full flex-col text-white">
      <header className="flex items-center justify-between px-4 py-4 sm:px-6">
        <h1 className="text-xl font-black tracking-[0.2em] sm:text-2xl md:text-3xl">PANOPTES</h1>
        <div className="relative flex items-center gap-2 sm:gap-3">
          <a
            href={GITHUB_URL_DOCS}
            className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-2 text-xs font-semibold text-white backdrop-blur transition hover:border-white/50 hover:bg-white/20 sm:px-4 sm:text-sm"
            target="_blank"
            rel="noreferrer"
          >
            <GithubIcon />
            GitHub
          </a>
          <div className="relative">
            <button
              ref={toggleRef}
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-2 text-xs font-semibold text-white backdrop-blur transition hover:border-white/50 hover:bg-white/20 sm:px-4 sm:text-sm"
              aria-expanded={open ? "true" : "false"}
              aria-haspopup="true"
              onClick={() => setOpen((v) => !v)}
            >
              <WorldIcon />
              <span>{t(copy.hero.langLabel, lang)}</span>
            </button>
            <div
              ref={menuRef}
              className={`absolute right-0 top-[110%] min-w-[140px] rounded-xl border border-white/20 bg-slate-900/90 px-3 py-2 text-xs text-white shadow-xl backdrop-blur ${open ? "" : "hidden"}`}
            >
              {(["es", "en"] as Lang[]).map((code) => (
                <button
                  key={code}
                  type="button"
                  className={`flex w-full items-center justify-between rounded-lg px-2 py-2 text-left hover:bg-white/10 ${lang === code ? "text-emerald-200" : ""}`}
                  onClick={() => switchLang(code)}
                >
                  {code === "es" ? t(copy.language.spanish, lang) : t(copy.language.english, lang)}
                  <span className={`text-[10px] ${lang === code ? "text-emerald-300" : "text-cyan-200"}`}>
                    {code.toUpperCase()}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <div className="relative flex flex-1 items-center justify-center">
        <div className="grid h-full w-full max-w-[1800px] grid-cols-1 items-center gap-12 px-6 pt-20 sm:px-8 lg:grid-cols-2 lg:gap-20 lg:px-16">
          <div className="flex flex-col justify-center space-y-8 lg:pl-8">
            <div className="space-y-4">
              <h1 className="text-5xl font-black leading-[1.05] sm:text-6xl lg:text-7xl xl:text-8xl">PANOPTES</h1>
            </div>

            <p key={lang} className="max-w-xl text-lg leading-relaxed text-slate-200 sm:text-xl lg:text-2xl">
              {t(copy.hero.description, lang)}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-4 sm:gap-4 sm:pt-6">
              <a
                href="/docs/getting-started"
                className="group inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-white/30 bg-gradient-to-r from-cyan-500/20 via-white/5 to-purple-500/20 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 backdrop-blur transition hover:border-white/50 hover:from-cyan-400/30 hover:to-purple-400/30 hover:shadow-cyan-400/40 sm:px-6 sm:text-base lg:px-8 lg:py-4"
              >
                <BookIcon />
                {t(copy.hero.ctaDocs, lang)}
              </a>

              <a
                href="/docs/guides/installations"
                className="group inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-white/30 bg-gradient-to-r from-emerald-400/25 via-cyan-400/20 to-blue-500/25 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-400/20 backdrop-blur-md transition-all hover:border-white/50 hover:-translate-y-0.5 hover:shadow-emerald-300/40 sm:px-6 sm:text-base lg:px-8 lg:py-4"
              >
                <RayIcon />
                {t(copy.hero.ctaStart, lang)}
              </a>
            </div>
          </div>
        </div>
      </div>

      <footer className="pointer-events-auto relative inset-x-0 bottom-0 z-30 mt-auto flex justify-center px-4 pb-6 pt-4">
        <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="text-2xl font-black tracking-[0.25em] text-white">
          {t(copy.footer.author, lang)}
        </a>
      </footer>
    </div>
  );
};

export default HeroShell;
