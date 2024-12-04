import { WorldIcon } from "./icons";
import { useLanguage } from "../hooks/useLanguage";

export function LanguageToggle() {
  const { lang, setLang } = useLanguage();
  const toggle = () => setLang(lang === "es" ? "en" : "es");

  return (
    <button
      type="button"
      onClick={toggle}
      className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-2 text-xs font-semibold text-white backdrop-blur transition hover:border-white/50 hover:bg-white/20 sm:px-4 sm:text-sm"
    >
      <WorldIcon />
      <span className="uppercase">{lang}</span>
    </button>
  );
}
