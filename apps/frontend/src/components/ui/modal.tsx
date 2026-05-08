import { Show, onCleanup, onMount, type JSX } from "solid-js";
import { Portal } from "solid-js/web";
import { X } from "lucide-solid";

import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: JSX.Element;
  class?: string;
};

export function Modal(props: ModalProps) {
  // Close on Escape
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") props.onClose();
  };

  onMount(() => {
    window.addEventListener("keydown", handleKeyDown);
  });

  onCleanup(() => {
    window.removeEventListener("keydown", handleKeyDown);
  });

  return (
    <Show when={props.isOpen}>
      <Portal>
        <div class="fixed inset-0 z-50 flex items-center justify-center p-5">
          {/* Overlay */}
          <div
            class="absolute inset-0 bg-(--bg)/90 backdrop-blur-[2px]"
            onClick={() => props.onClose()}
          />

          {/* Modal Content */}
          <div
            class={cn(
              "relative w-full max-w-sm overflow-hidden rounded-xl bg-(--sub-alt) p-5",
              props.class,
            )}
          >
            <Show when={props.title}>
              <div class="mb-4 flex items-center justify-between">
                <h3 class="text-lg font-bold text-(--main) lowercase">
                  {props.title}
                </h3>
                <Button
                  onClick={() => props.onClose()}
                  class="h-7 w-7 bg-transparent p-0 text-(--sub) hover:bg-(--sub-alt) hover:text-(--main)"
                >
                  <X size={18} />
                </Button>
              </div>
            </Show>
            {props.children}
          </div>
        </div>
      </Portal>
    </Show>
  );
}
