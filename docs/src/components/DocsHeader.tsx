import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DocsSidebar } from "./DocsSidebar";
import { ModeToggle } from "./ModeToggle";
import { LanguageToggle } from "./LanguageToggle";

export function DocsHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[color:var(--doc-border)] bg-[color:var(--doc-bg)]/80 backdrop-blur supports-[backdrop-filter]:bg-[color:var(--doc-bg)]/80">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between gap-3">
        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="mr-1 px-2 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <DocsSidebar />
          </SheetContent>
        </Sheet>

        {/* Right actions */}
        <div className="flex flex-1 items-center justify-end gap-2">
          <LanguageToggle />
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
