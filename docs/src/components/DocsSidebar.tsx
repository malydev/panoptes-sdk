import { useState } from "react";
import { ChevronRight, FileText, BookOpen, Layers, Plug } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  title: string;
  href: string;
  icon?: React.ReactNode;
  items?: NavItem[];
}

const navigationItems: NavItem[] = [
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
      {
        title: "Configuration",
        href: "/docs/guides/configuration",
      },
    ],
  },
  {
    title: "Integrations",
    href: "/docs/integrations",
    icon: <Plug className="h-4 w-4" />,
  },
];

const SDK_VERSION = "0.2.2";

const translations = {
  "Getting Started": {
    en: "Getting Started",
    es: "Comenzando"
  },
  "Comparison": {
    en: "Comparison",
    es: "Comparación"
  },
  "Guides": {
    en: "Guides",
    es: "Guías"
  },
  "Installations": {
    en: "Installations",
    es: "Instalaciones"
  },
  "Configuration": {
    en: "Configuration",
    es: "Configuración"
  },
  "Integrations": {
    en: "Integrations",
    es: "Integraciones"
  },
  "Quick Links": {
    en: "Quick Links",
    es: "Enlaces Rápidos"
  },
  "GitHub Repository": {
    en: "GitHub Repository",
    es: "Repositorio de GitHub"
  },
  "NPM Package": {
    en: "NPM Package",
    es: "Paquete NPM"
  }
};

interface SidebarItemProps {
  item: NavItem;
  level?: number;
}

function SidebarItem({ item, level = 0 }: SidebarItemProps) {
  const [isOpen, setIsOpen] = useState(true);
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
          "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all",
          "hover:bg-slate-100 dark:bg-slate-950 hover:text-indigo-500 dark:text-violet-400",
          "active:scale-[0.98]",
          level === 0 ? "font-medium text-slate-900 dark:text-slate-200" : "font-normal text-slate-600 dark:text-slate-400 pl-6",
          hasChildren && "cursor-pointer"
        )}
      >
        {item.icon && (
          <span className="shrink-0 transition-colors group-hover:text-indigo-500 dark:text-violet-400">
            {item.icon}
          </span>
        )}
        <span className="flex-1">
          {translations[item.title as keyof typeof translations] ? (
            <>
              <span className="lang-en">{translations[item.title as keyof typeof translations].en}</span>
              <span className="lang-es">{translations[item.title as keyof typeof translations].es}</span>
            </>
          ) : (
            item.title
          )}
        </span>
        {hasChildren && (
          <ChevronRight
            className={cn(
              "h-4 w-4 shrink-0 transition-all duration-200",
              isOpen && "rotate-90",
              "group-hover:text-indigo-500 dark:text-violet-400"
            )}
          />
        )}
      </a>
      {hasChildren && isOpen && (
        <div className="mt-1 space-y-0.5 border-l-2 border-slate-200/60 dark:border-slate-700/50 ml-5 pl-1">
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
    <aside className="w-full flex flex-col h-screen">
      <div className="px-4 py-4 flex-shrink-0">
        <a href="/" className="group block">
          <div className="flex items-center gap-3 rounded-lg border border-slate-200/60 dark:border-slate-700/50 bg-white dark:bg-gray-900 p-3 shadow-sm transition-all hover:shadow-lg hover:border-indigo-500 dark:hover:border-violet-400">
            <img
              src="/panoptes.webp"
              alt="Panoptes Logo"
              className="h-10 w-10 rounded object-contain flex-shrink-0"
            />
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-slate-900 dark:text-slate-200 group-hover:text-indigo-500 dark:text-violet-400 transition-colors truncate">
                Panoptes SDK
              </span>
              <span className="text-xs text-slate-600 dark:text-slate-400 truncate">
                Documentation
              </span>
            </div>
          </div>
        </a>
      </div>

      <nav className="px-3 flex-1 overflow-hidden">
        <div className="space-y-1">
          {navigationItems.map((item) => (
            <SidebarItem key={item.href} item={item} />
          ))}
        </div>
      </nav>

      <div className="px-4 py-3 border-t border-slate-200/60 dark:border-slate-700/50 flex-shrink-0 space-y-3">
        {/* Version Badge */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
            <span className="lang-en">Version</span>
            <span className="lang-es">Versión</span>
          </span>
          <span className="inline-flex items-center rounded-full bg-indigo-500/10 dark:bg-violet-400/10 px-2.5 py-0.5 text-xs font-semibold text-indigo-600 dark:text-violet-400">
            v{SDK_VERSION}
          </span>
        </div>

        <div className="text-xs text-slate-600 dark:text-slate-400 space-y-2">
          <p className="font-medium text-slate-700 dark:text-slate-300">
            <span className="lang-en">Resources</span>
            <span className="lang-es">Recursos</span>
          </p>
          <div className="space-y-1.5">
            <a
              href="https://github.com/malydev/panoptes-sdk"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-indigo-500 dark:hover:text-violet-400 transition-colors group"
            >
              <svg className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <span className="lang-en">GitHub</span>
              <span className="lang-es">GitHub</span>
            </a>
            <a
              href="https://www.npmjs.com/package/panoptes-sdk"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-indigo-500 dark:hover:text-violet-400 transition-colors group"
            >
              <svg className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100" fill="currentColor" viewBox="0 0 24 24">
                <path d="M0 7.334v8h6.666v1.332H12v-1.332h12v-8H0zm6.666 6.664H5.334v-4H3.999v4H1.335V8.667h5.331v5.331zm4 0v1.336H8.001V8.667h5.334v5.332h-2.669v-.001zm12.001 0h-1.33v-4h-1.336v4h-1.335v-4h-1.33v4h-2.671V8.667h8.002v5.331zM10.665 10H12v2.667h-1.335V10z"/>
              </svg>
              <span className="lang-en">NPM</span>
              <span className="lang-es">NPM</span>
            </a>
            <a
              href="https://github.com/malydev/panoptes-sdk/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-indigo-500 dark:hover:text-violet-400 transition-colors group"
            >
              <svg className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="lang-en">Report Issue</span>
              <span className="lang-es">Reportar Issue</span>
            </a>
            <a
              href="https://github.com/malydev/panoptes-sdk/releases"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-indigo-500 dark:hover:text-violet-400 transition-colors group"
            >
              <svg className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <span className="lang-en">Changelog</span>
              <span className="lang-es">Changelog</span>
            </a>
          </div>
        </div>
      </div>
    </aside>
  );
}
