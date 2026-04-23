import type { JSX } from "solid-js";
import { splitProps } from "solid-js";
import { cn } from "@/lib/cn";

type BannerVariant = "default" | "error";

type BannerProps = JSX.HTMLAttributes<HTMLDivElement> & {
  variant?: BannerVariant;
};

const bannerVariants: Record<BannerVariant, string> = {
  default: "border-(--sub)/35 bg-(--sub-alt)",
  error: "border-(--error)/50 bg-(--error-extra)/45",
};

export function Banner(props: BannerProps) {
  const [local, rest] = splitProps(props, ["children", "class", "variant"]);

  return (
    <div
      {...rest}
      class={cn(
        "rounded-lg border px-4 py-3 text-sm leading-normal text-(--text)",
        bannerVariants[local.variant ?? "default"],
        local.class,
      )}
    >
      {local.children}
    </div>
  );
}

export default Banner;
