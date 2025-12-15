import { Languages } from "lucide-react";
import { useLanguage } from "../hooks/useLanguage";
import { Button } from "./ui/button";

export function LanguageToggle() {
  const { lang, setLang } = useLanguage();
  const toggle = () => setLang(lang === "es" ? "en" : "es");

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggle}
      className="hover:bg-slate-100 dark:bg-slate-950 hover:text-indigo-500 dark:text-violet-400"
    >
      <Languages className="h-4 w-4" />
      <span className="ml-2 text-xs font-semibold uppercase">{lang}</span>
    </Button>
  );
}
