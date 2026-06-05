import {
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
  Show,
} from "solid-js";
import { Command, Search } from "lucide-solid";

import CommandlineList from "@/features/commandline/components/commandline-list";
import { createCommandlineRegistry } from "@/features/commandline/registry";
import type {
  CommandlineItem,
  CommandlineScope,
} from "@/features/commandline/types";
import { filterCommands, getScopeLabel } from "@/features/commandline/utils";
import { themeManager } from "@/features/content/themes/manager";

export function Commandline() {
  const cmd = createCommandlineController();

  createEffect(() => {
    if (cmd.scope() === "themes" && cmd.isOpen()) {
      const item = cmd.visibleItems()[cmd.selectedIndex()];

      if (item && item.id.startsWith("theme-")) {
        themeManager.preview(item.id.replace("theme-", "") as any);
      }

      onCleanup(() => themeManager.reset());
      return;
    }

    if (cmd.isOpen()) {
      themeManager.reset();
    }
  });

  return (
    <>
      <Show when={!cmd.isOpen()}>
        <button
          type="button"
          class="fixed right-5 bottom-5 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-(--main) text-(--bg) shadow-lg transition hover:opacity-90 sm:hidden"
          onClick={cmd.open}
          aria-label="Open command line"
        >
          <Command size={20} strokeWidth={2.4} />
        </button>
      </Show>

      <Show when={cmd.isOpen()}>
        <div
          class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-(--bg)/90 px-5"
          onClick={cmd.close}
        >
          <div class="w-full max-w-[450px]">
            <div
              class="overflow-hidden rounded-lg bg-(--sub-alt)"
              onClick={(event) => event.stopPropagation()}
            >
              <CommandlineInput
                ref={cmd.setInputRef}
                value={cmd.query()}
                placeholder={cmd.placeholder()}
                onInput={cmd.updateQuery}
              />

              <CommandlineList
                items={cmd.visibleItems()}
                selectedIndex={cmd.selectedIndex()}
                scope={cmd.scope()}
                interactionType={cmd.interactionType()}
                onHoverItem={cmd.hoverItem}
                onSelectItem={(item) => cmd.selectCurrent(item)}
              />
            </div>
          </div>
        </div>
      </Show>
    </>
  );
}

function createCommandlineController() {
  const [isOpen, setIsOpen] = createSignal(false);
  const [query, setQuery] = createSignal("");
  const [scope, setScope] = createSignal<CommandlineScope>("root");
  const [selectedIndex, setSelectedIndex] = createSignal(0);
  const [interactionType, setInteractionType] = createSignal<
    "keyboard" | "mouse"
  >("keyboard");

  let inputRef: HTMLInputElement | undefined;

  const registry = createMemo(() => createCommandlineRegistry(setScope));

  const visibleItems = createMemo(() =>
    filterCommands(registry()[scope()], query()),
  );

  const isNestedScope = createMemo(() => scope() !== "root");

  const placeholder = createMemo(() =>
    isNestedScope()
      ? `${getScopeLabel(
          scope() as Exclude<CommandlineScope, "root">,
        ).toLowerCase()}...`
      : "Search...",
  );

  createEffect(() => {
    const maxIndex = visibleItems().length - 1;

    if (selectedIndex() > maxIndex) {
      setSelectedIndex(Math.max(maxIndex, 0));
    }
  });

  createEffect(() => {
    if (isOpen()) {
      scope();
      inputRef?.focus();
    }
  });

  createEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        toggle();
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        goBack();
        return;
      }

      if (!isOpen()) return;

      if (event.key === "Backspace" && query() === "" && isNestedScope()) {
        event.preventDefault();
        goBack();
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        moveDown();
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        moveUp();
        return;
      }

      if (event.key === "Enter") {
        event.preventDefault();
        selectCurrent();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    onCleanup(() => {
      window.removeEventListener("keydown", handleKeyDown);
    });
  });

  //
  // private helpers
  //

  const resetSearch = () => {
    setQuery("");
    setSelectedIndex(0);
  };

  const selectItem = (item: CommandlineItem) => {
    const previousScope = scope();

    item.onSelect();

    if (previousScope === scope()) {
      close();
      return;
    }

    resetSearch();
  };

  const moveSelection = (direction: 1 | -1) => {
    const items = visibleItems();

    if (items.length === 0) {
      setSelectedIndex(0);
      return;
    }

    setSelectedIndex((current) => {
      return (current + direction + items.length) % items.length;
    });
  };

  //
  // public api
  //

  const open = () => {
    setIsOpen(true);
  };

  const close = () => {
    resetSearch();
    setScope("root");
    setIsOpen(false);
  };

  const toggle = () => {
    setIsOpen((current) => !current);
  };

  const updateQuery = (value: string) => {
    setQuery(value);
    setSelectedIndex(0);
  };

  const moveUp = () => {
    setInteractionType("keyboard");
    moveSelection(-1);
  };

  const moveDown = () => {
    setInteractionType("keyboard");
    moveSelection(1);
  };

  const hoverItem = (index: number) => {
    setInteractionType("mouse");
    setSelectedIndex(index);
  };

  const selectCurrent = (item?: CommandlineItem) => {
    const target = item ?? visibleItems()[selectedIndex()];

    if (!target) return;

    selectItem(target);
  };

  const goBack = () => {
    if (query()) {
      resetSearch();
      return;
    }

    if (isNestedScope()) {
      setScope("root");
      setSelectedIndex(0);
      return;
    }

    close();
  };

  const setInputRef = (el: HTMLInputElement) => {
    inputRef = el;
  };

  return {
    // state
    isOpen,
    query,
    scope,
    selectedIndex,
    interactionType,

    // derived
    visibleItems,
    placeholder,
    isNestedScope,

    // actions
    open,
    close,
    toggle,
    updateQuery,
    moveUp,
    moveDown,
    hoverItem,
    selectCurrent,
    goBack,

    // refs
    setInputRef,
  };
}

type CommandlineInputProps = {
  value: string;
  placeholder: string;
  onInput: (value: string) => void;
  ref?: (el: HTMLInputElement) => void;
};

function CommandlineInput(props: CommandlineInputProps) {
  return (
    <div class="flex items-center gap-3 px-4 py-2">
      <Search class="size-4 text-(--sub)" />
      <input
        ref={props.ref}
        value={props.value}
        class="w-full text-base outline-none placeholder:text-(--sub)"
        placeholder={props.placeholder}
        onInput={(event) => props.onInput(event.currentTarget.value)}
      />
    </div>
  );
}
