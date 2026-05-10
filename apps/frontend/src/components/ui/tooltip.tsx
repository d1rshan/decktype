import { Show, splitProps, type JSX } from "solid-js";

import { cn } from "@/lib/cn";

type TooltipProps = JSX.HTMLAttributes<HTMLDivElement> & {
  content?: string;
  disabled?: boolean;
};

export function Tooltip(props: TooltipProps) {
  const [local, rest] = splitProps(props, [
    "children",
    "class",
    "content",
    "disabled",
  ]);

  return (
    <div {...rest} class={cn("group relative inline-flex", local.class)}>
      {local.children}
      <Show when={!local.disabled && local.content}>
        {(content) => (
          <div class="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1 hidden -translate-x-1/2 opacity-0 transition-all duration-150 ease-out group-hover:block group-hover:-translate-y-0.5 group-hover:opacity-100">
            <div class="w-max max-w-48 rounded-[5px] bg-[#0a0a0a]/95 px-2 py-1 text-center text-[11px] leading-tight text-white">
              {content()}
            </div>
            <div class="mx-auto h-0 w-0 border-x-[4px] border-t-[5px] border-x-transparent border-t-[#0a0a0a]/95" />
          </div>
        )}
      </Show>
    </div>
  );
}

export default Tooltip;
