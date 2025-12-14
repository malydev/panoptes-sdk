import { useState } from "react";
import { ChevronRight, FileText, BookOpen, Layers, Plug } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  title: string;
  href: string;
  icon?: React.ReactNode;
  items?: NavItem[];
}

const navigation: NavItem[] = [
  {
    title: "Getting Started",
    href: "/docs/getting-started",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    title: "Comparison",
    href: "/docs/comparison",
    icon: <Layers className="h-4 w-4" />,
  },
  {
    title: "Guides",
    href: "#",
    icon: <BookOpen className="h-4 w-4" />,
    items: [
      {
        title: "Installations",
        href: "/docs/guides/installations",
      },
    ],
  },
  {
    title: "Integrations",
    href: "/docs/integrations",
    icon: <Plug className="h-4 w-4" />,
  },
];

interface SidebarItemProps {
  item: NavItem;
  level?: number;
}

function SidebarItem({ item, level = 0 }: SidebarItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = item.items && item.items.length > 0;

  return (
    <div>
      <a
        href={item.href}
        onClick={(e) => {
          if (hasChildren) {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
        className={cn(
          "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent hover:text-accent-foreground",
          level === 0 ? "font-medium" : "font-normal",
          hasChildren && "cursor-pointer"
        )}
      >
        {item.icon && <span className="shrink-0">{item.icon}</span>}
        <span className="flex-1">{item.title}</span>
        {hasChildren && (
          <ChevronRight
            className={cn(
              "h-4 w-4 shrink-0 transition-transform",
              isOpen && "rotate-90"
            )}
          />
        )}
      </a>
      {hasChildren && isOpen && (
        <div className="ml-4 mt-1 space-y-1 border-l pl-2">
          {item.items?.map((child) => (
            <SidebarItem key={child.href} item={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export function DocsSidebar() {
  return (
    <aside className="w-full">
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <div className="flex flex-col gap-1 rounded-xl border border-[color:var(--doc-border)] bg-[color:var(--doc-surface)]/90 p-3 shadow-sm">
            <span className="text-xs uppercase tracking-[0.2em] text-[color:var(--doc-text)]/70">
              Panoptes
            </span>
            <span className="text-lg font-bold text-[color:var(--doc-text)]">
              SDK Docs
            </span>
            <span className="text-xs text-[color:var(--doc-text)]/60">
              Enterprise SQL auditing toolkit
            </span>
          </div>
        </div>
        <div className="space-y-1 px-3">
          {navigation.map((item) => (
            <SidebarItem key={item.href} item={item} />
          ))}
        </div>
      </div>
    </aside>
  );
}
