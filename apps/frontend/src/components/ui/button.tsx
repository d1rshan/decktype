import { splitProps, type JSX } from "solid-js";
import { Dynamic } from "solid-js/web";
import { cn } from "@/lib/cn";

type ButtonProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> &
  JSX.AnchorHTMLAttributes<HTMLAnchorElement> & {
    href?: string;
  };

export function Button(props: ButtonProps) {
  const [local, rest] = splitProps(props, [
    "class",
    "children",
    "disabled",
    "href",
  ]);
  const isAnchor = Boolean(local.href);
  const isDisabled = !isAnchor && Boolean(local.disabled);

  return (
    <Dynamic
      component={isAnchor ? "a" : "button"}
      href={local.href}
      disabled={isAnchor ? undefined : local.disabled}
      {...(rest as any)}
      class={cn(
        "inline-flex items-center justify-center rounded-lg bg-(--sub-alt) px-4 py-3 text-sm font-medium text-(--text) transition-colors",
        isDisabled
          ? "cursor-not-allowed opacity-50"
          : "cursor-pointer hover:bg-(--text) hover:text-(--sub-alt)",
        local.class,
      )}
    >
      {local.children}
    </Dynamic>
  );
}

export default Button;
