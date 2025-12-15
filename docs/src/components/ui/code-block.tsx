import { cn } from "@/lib/utils";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "./button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
  showLineNumbers?: boolean;
}

export function CodeBlock({ code, language = "typescript", className, showLineNumbers = false }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("group relative not-prose my-6", className)}>
      <div className="flex items-center justify-between rounded-t-lg border border-slate-200/60 dark:border-slate-700/50 border-b-0 bg-slate-100 dark:bg-slate-950 px-4 py-2.5">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">
          {language}
        </span>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 opacity-0 transition-all group-hover:opacity-100 hover:bg-slate-200/60 dark:hover:bg-slate-700/50 hover:text-indigo-500 dark:text-violet-400"
              onClick={copyToClipboard}
            >
              {copied ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent sideOffset={6} className="text-slate-50 dark:text-slate-900 bg-slate-900 dark:bg-slate-200">
            <span className="lang-en">{copied ? "Copied" : "Copy"}</span>
            <span className="lang-es">{copied ? "Copiado" : "Copiar"}</span>
          </TooltipContent>
        </Tooltip>
      </div>
      <pre className={cn(
        "overflow-x-auto rounded-b-lg border border-slate-200/60 dark:border-slate-700/50 bg-slate-100 dark:bg-slate-950 p-4",
        showLineNumbers && "pl-12"
      )}>
        <code className="relative block text-sm font-mono text-slate-900 dark:text-slate-200 leading-relaxed">
          {code}
        </code>
      </pre>
    </div>
  );
}

interface InlineCodeProps {
  children: React.ReactNode;
  className?: string;
}

export function InlineCode({ children, className }: InlineCodeProps) {
  return (
    <code className={cn(
      "relative rounded border border-slate-200/60 dark:border-slate-700/50 bg-slate-100 dark:bg-slate-950 px-[0.4rem] py-[0.25rem] font-mono text-sm font-medium text-indigo-500 dark:text-violet-400",
      className
    )}>
      {children}
    </code>
  );
}
