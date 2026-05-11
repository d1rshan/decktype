import type { Component } from "solid-js";
import { Index, createEffect, Show } from "solid-js";
import { Kbd } from "@/components/ui/kbd";
import type { GamePhase } from "../use-survival-game";

export type SurvivalFieldProps = {
  words: string[];
  currentWordIndex: number;
  currentInput: string;
  phase: GamePhase;
  wpm: number;
  onFieldClick: () => void;
};

export const SurvivalField: Component<SurvivalFieldProps> = (props) => {
  let containerRef: HTMLDivElement | undefined;

  createEffect(() => {
    if (props.currentWordIndex > 0 && containerRef) {
      const activeWordEl = containerRef.querySelector(".active-word");
      if (activeWordEl) {
        activeWordEl.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  });

  return (
    <div
      class="absolute inset-0 z-0 h-full w-full cursor-text overflow-hidden bg-(--bg)"
      onClick={props.onFieldClick}
    >
      {props.phase === "game-over" && (
        <div class="absolute inset-0 z-20 flex items-center justify-center bg-(--bg)/90 backdrop-blur-sm">
          <div class="text-center">
            <p class="text-6xl leading-none font-bold tracking-tighter text-(--main) sm:text-8xl">
              {props.wpm}
            </p>
            <div class="mt-12 flex flex-col items-center gap-4">
              <div class="flex items-center gap-2">
                <Kbd>tab</Kbd>
                <p class="text-base leading-normal">to restart</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div
        ref={containerRef}
        class="flex flex-wrap content-start gap-x-4 gap-y-3 text-3xl font-mono leading-relaxed text-(--sub)/50 overflow-hidden h-full w-full p-8 select-none scroll-smooth pb-32"
      >
        <Index each={props.words}>
          {(word, i) => {
            return (
              <div
                class={`relative ${
                  i === props.currentWordIndex ? "active-word" : ""
                }`}
              >
                <Show when={i < props.currentWordIndex}>
                  <span class="text-(--text)">{word()}</span>
                </Show>

                <Show when={i > props.currentWordIndex}>
                  <span>{word()}</span>
                </Show>

                <Show when={i === props.currentWordIndex}>
                  <span class="text-(--text) inline-flex relative items-center">
                    <Index each={word().split("")}>
                      {(char, charIdx) => {
                        return (
                          <span class="relative">
                            <span
                              class={(() => {
                                const inputChar = props.currentInput[charIdx];
                                if (inputChar === undefined)
                                  return "text-(--sub)/50";
                                if (inputChar === char())
                                  return "text-(--text)";
                                return "text-(--error)";
                              })()}
                            >
                              {props.currentInput.length === charIdx && (
                                <span class="absolute bottom-[-2px] left-0 h-[2px] w-full bg-(--caret) animate-pulse" />
                              )}
                              {char()}
                            </span>
                          </span>
                        );
                      }}
                    </Index>

                    <Show when={props.currentInput.length === word().length}>
                      <span class="absolute bottom-[-2px] right-[-0.6em] h-[2px] w-[0.6em] bg-(--caret) animate-pulse" />
                    </Show>

                    <Show when={props.currentInput.length > word().length}>
                      <span class="flex items-center">
                        <Index
                          each={props.currentInput
                            .slice(word().length)
                            .split("")}
                        >
                          {(extraChar) => (
                            <span class="text-(--error) opacity-80">
                              {extraChar()}
                            </span>
                          )}
                        </Index>
                        <span class="absolute bottom-[-2px] right-[-0.6em] h-[2px] w-[0.6em] bg-(--caret) animate-pulse" />
                      </span>
                    </Show>
                  </span>
                </Show>
              </div>
            );
          }}
        </Index>
      </div>
    </div>
  );
};
