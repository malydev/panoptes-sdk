import { useEffect, useState } from "react";

export type Lang = "en" | "es";
const LANG_KEY = "lang";

function getInitial(): Lang {
  if (typeof document !== "undefined") {
    const attr = document.documentElement.dataset.lang;
    if (attr === "en" || attr === "es") return attr;
  }
  if (typeof localStorage !== "undefined") {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved === "en" || saved === "es") return saved;
  }
  return "en";
}

export function useLanguage() {
  const [lang, setLang] = useState<Lang>(() => getInitial());

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.dataset.lang = lang;
      document.documentElement.lang = lang;
    }
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(LANG_KEY, lang);
    }
  }, [lang]);

  return { lang, setLang };
}
