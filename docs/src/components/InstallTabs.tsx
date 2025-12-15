import { useState } from "react";
import { CodeBlock } from "./ui/code-block";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { cn } from "@/lib/utils";

const managers = [
  { key: "npm", label: "npm", cmd: "npm install @panoptes/sdk" },
  { key: "pnpm", label: "pnpm", cmd: "pnpm add @panoptes/sdk" },
  { key: "yarn", label: "yarn", cmd: "yarn add @panoptes/sdk" },
];

export function InstallTabs() {
  const [active, setActive] = useState("npm");
  const current = managers.find((m) => m.key === active) ?? managers[0];

  return (
    <>
      <div className="mb-2 flex flex-wrap items-center gap-2 text-sm">
        {managers.map((m, idx) => (
          <div key={m.key} className="flex items-center">
            <Button
              variant="link"
              size="sm"
              className={cn(
                "px-0 py-1 font-semibold no-underline",
                active === m.key
                  ? "text-blue-600 underline underline-offset-8 decoration-2"
                  : "text-gray-500 hover:text-gray-700"
              )}
              onClick={() => setActive(m.key)}
            >
              {m.label}
            </Button>

            {idx < managers.length - 1 && (
              <Separator
                orientation="vertical"
                className="mx-3 h-4 bg-gray-300"
              />
            )}
          </div>
        ))}
      </div>

      <Separator className="mb-2" />

      <CodeBlock language="bash" code={current.cmd} />
    </>
  );
}
