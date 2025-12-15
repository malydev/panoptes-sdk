import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DocsSidebar } from "./DocsSidebar";
import { ModeToggle } from "./ModeToggle";
import { LanguageToggle } from "./LanguageToggle";

export function DocsHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/60 dark:border-slate-700/50 bg-white dark:bg-slate-950/95 backdrop-blur-lg shadow-sm">
      <div className="flex h-16 items-center justify-between gap-4 px-4 md:px-6 lg:px-8">
        {/* Left side - Mobile menu + Logo */}
        <div className="flex items-center gap-3">
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden hover:bg-slate-100 dark:bg-slate-950 hover:text-indigo-500 dark:text-violet-400"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <DocsSidebar />
            </SheetContent>
          </Sheet>

          {/* Logo - visible on mobile */}
          <a href="/" className="flex items-center gap-2 md:hidden">
            <img
              src="/panoptes.webp"
              alt="Panoptes Logo"
              className="h-8 w-8 rounded object-contain"
            />
            <span className="font-bold text-slate-900 dark:text-slate-200">Panoptes</span>
          </a>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <LanguageToggle client:load />
          <ModeToggle client:load />
        </div>
      </div>
    </header>
  );
}
