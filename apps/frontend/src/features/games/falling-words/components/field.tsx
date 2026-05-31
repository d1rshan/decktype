import { For } from "solid-js";

import { Kbd } from "@/components/ui/kbd";

import type { GamePhase } from "../../core/types";
import type { FallingWord } from "../types";

type FieldProps = {
  ref?: (el: HTMLDivElement) => void;
  words: FallingWord[];
  currentInput: string;
  focusedWordId: number | null;
  phase: GamePhase;
  onFieldClick: () => void;
};

export function Field(props: FieldProps) {
  return (
    <div
      ref={props.ref}
      class="absolute inset-0 z-0 h-full w-full cursor-text overflow-hidden bg-(--bg)"
      onClick={props.onFieldClick}
    >
      {props.phase === "idle" && (
        <div class="absolute inset-0 flex items-center justify-center p-6 text-center">
          <div class="flex items-center gap-2">
            <Kbd>enter</Kbd>
            <p class="text-base leading-normal">to start</p>
          </div>
        </div>
      )}

      {props.words.map((word) => {
        const isFocused = word.id === props.focusedWordId;
        const isPrefixMatch =
          props.currentInput.length > 0 &&
          word.text.startsWith(props.currentInput);
        const isExactMatch =
          props.currentInput.length > 0 &&
          word.text === props.currentInput &&
          isFocused;
        const typedLength = isFocused ? props.currentInput.length : 0;
        const characters = word.text.split("");

        return (
          <div
            class={`absolute font-mono text-2xl leading-tight tracking-tight transition-all duration-150 ${
              isExactMatch
                ? "text-(--main)"
                : isFocused
                  ? "text-(--sub)"
                  : isPrefixMatch
                    ? "text-(--sub) opacity-60"
                    : "text-(--sub) opacity-40"
            }`}
            style={{
              transform: `translate(${word.x}px, ${word.y}px) rotate(${word.rotation}deg)`,
            }}
          >
            <span class="relative inline-flex items-center">
              {characters.map((character, index) => {
                const isTyped = isFocused && index < typedLength;
                const isCaretSlot = isFocused && index === typedLength;

                return (
                  <span
                    class={`relative transition-colors duration-200 ${
                      isTyped
                        ? props.currentInput.charAt(index) === character
                          ? "text-(--text)"
                          : "text-(--error)"
                        : "text-inherit"
                    }`}
                  >
                    {isCaretSlot && (
                      <span class="absolute bottom-[-2px] left-0 h-[2px] w-full bg-(--caret) animate-pulse" />
                    )}
                    {character}
                  </span>
                );
              })}

              {isFocused && typedLength > characters.length && (
                <span class="flex items-center">
                  <For
                    each={props.currentInput.slice(characters.length).split("")}
                  >
                    {(char) => (
                      <span class="text-(--error) opacity-80">{char}</span>
                    )}
                  </For>
                  <span class="ml-[1px] h-[2px] w-[0.6em] self-end bg-(--caret) animate-pulse mb-[2px]" />
                </span>
              )}

              {isFocused && typedLength === characters.length && (
                <span class="ml-[1px] h-[2px] w-[0.6em] self-end bg-(--caret) animate-pulse mb-[2px]" />
              )}
            </span>
          </div>
        );
      })}
    </div>
  );
}
