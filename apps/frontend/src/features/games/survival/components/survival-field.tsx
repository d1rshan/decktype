import type { Component } from "solid-js";
import { Index, createEffect, Show } from "solid-js";
import { Kbd } from "@/components/ui/kbd";
import type { GamePhase } from "../use-survival-game";

export type SurvivalFieldProps = {
  words: string[];
  currentWordIndex: number;
  currentInput: string;
  pastInputs: string[];
  phase: GamePhase;
  score: number;
  onFieldClick: () => void;
};

const PastWord: Component<{ word: string; pastInput: string }> = (props) => {
  return (
    <span class="inline-flex relative items-center text-(--text)">
      <Index each={props.word.split("")}>
        {(char, charIdx) => {
          const isCorrect = () => props.pastInput[charIdx] === char();
          const hasInput = () => props.pastInput[charIdx] !== undefined;

          return (
            <span
              class={
                !hasInput()
                  ? "text-(--error) opacity-70"
                  : isCorrect()
                    ? "text-(--text)"
                    : "text-(--error)"
              }
            >
              {char()}
            </span>
          );
        }}
      </Index>
      <Show when={props.pastInput.length > props.word.length}>
        <span class="flex items-center text-(--error) opacity-80">
          {props.pastInput.slice(props.word.length)}
        </span>
      </Show>
    </span>
  );
};

const ActiveWord: Component<{ word: string; currentInput: string }> = (
  props,
) => {
  return (
    <span class="inline-flex relative items-center text-(--text)">
      <Index each={props.word.split("")}>
        {(char, charIdx) => {
          const isCorrect = () => props.currentInput[charIdx] === char();
          const hasInput = () => props.currentInput[charIdx] !== undefined;

          return (
            <span class="relative">
              <span
                class={
                  !hasInput()
                    ? "text-(--sub)/50"
                    : isCorrect()
                      ? "text-(--text)"
                      : "text-(--error)"
                }
              >
                <Show when={props.currentInput.length === charIdx}>
                  <span class="absolute bottom-[-2px] left-0 h-[2px] w-full bg-(--caret) animate-pulse" />
                </Show>
                {char()}
              </span>
            </span>
          );
        }}
      </Index>

      <Show when={props.currentInput.length === props.word.length}>
        <span class="absolute bottom-[-2px] right-[-0.6em] h-[2px] w-[0.6em] bg-(--caret) animate-pulse" />
      </Show>

      <Show when={props.currentInput.length > props.word.length}>
        <span class="flex items-center text-(--error) opacity-80">
          {props.currentInput.slice(props.word.length)}
          <span class="absolute bottom-[-2px] right-[-0.6em] h-[2px] w-[0.6em] bg-(--caret) animate-pulse" />
        </span>
      </Show>
    </span>
  );
};

export const SurvivalField: Component<SurvivalFieldProps> = (props) => {
  let containerRef: HTMLDivElement | undefined;

  createEffect(() => {
    if (containerRef && props.currentWordIndex >= 0) {
      const activeWordEl = containerRef.querySelector(
        ".active-word",
      ) as HTMLElement;
      if (activeWordEl) {
        const targetScrollTop =
          activeWordEl.offsetTop -
          containerRef.offsetHeight / 2 +
          activeWordEl.offsetHeight / 2;
        containerRef.scrollTo({ top: targetScrollTop, behavior: "smooth" });
      }
    }
  });

  return (
    <div
      class="absolute inset-0 z-0 h-full w-full cursor-text overflow-hidden bg-(--bg)"
      onClick={props.onFieldClick}
    >
      <Show when={props.phase === "game-over"}>
        <div class="absolute inset-0 z-20 flex items-center justify-center bg-(--bg)/90 backdrop-blur-sm">
          <div class="text-center">
            <p class="text-6xl leading-none font-bold tracking-tighter text-(--main) sm:text-8xl">
              {props.score.toLocaleString()}
            </p>
            <div class="mt-12 flex flex-col items-center gap-4">
              <div class="flex items-center gap-2">
                <Kbd>tab</Kbd>
                <p class="text-base leading-normal">to restart</p>
              </div>
            </div>
          </div>
        </div>
      </Show>

      <div class="absolute inset-0 flex items-center justify-center px-10">
        <div
          ref={containerRef}
          class="relative flex flex-wrap content-start gap-x-4 gap-y-3 text-2xl font-mono leading-tight tracking-tight text-(--sub)/50 overflow-hidden w-full max-w-5xl select-none scroll-smooth"
          style={{ height: "114px" }}
        >
          <Index each={props.words}>
            {(word, i) => (
              <div
                class={`relative ${
                  i === props.currentWordIndex ? "active-word" : ""
                }`}
              >
                <Show when={i < props.currentWordIndex}>
                  <PastWord
                    word={word()}
                    pastInput={props.pastInputs[i] || ""}
                  />
                </Show>

                <Show when={i === props.currentWordIndex}>
                  <ActiveWord word={word()} currentInput={props.currentInput} />
                </Show>

                <Show when={i > props.currentWordIndex}>
                  <span>{word()}</span>
                </Show>
              </div>
            )}
          </Index>
        </div>
      </div>
    </div>
  );
};
