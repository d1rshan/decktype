import { For, Show } from "solid-js";
import { getWordBank } from "@/features/content/word-banks/manager";
import { randomWord } from "@/features/games/utils";
import { createGameStore } from "./state-machine";
import { Word } from "./components/word";

const WORD_COUNT = 50;

const wordBank = getWordBank("english/core-1k");
const words = wordBank
  ? Array.from({ length: WORD_COUNT }, () => randomWord(wordBank.words))
  : [];

export function TypingTest() {
  const { state, onInput, reset } = createGameStore({
    words,
    isComplete: (s) => {
      const typed = s.input.split(" ");
      return typed.length === s.words.length && typed[typed.length - 1] !== "";
    },
  });

  let inputRef: HTMLInputElement | undefined;

  const typedWords = () => state.input.split(" ");
  const currentIndex = () => typedWords().length - 1;

  return (
    <div class="flex flex-col items-center justify-center min-h-screen bg-(--bg) text-(--text) p-8">
      <div class="text-sm text-(--sub) mb-4">
        Word {currentIndex() + 1} / {state.words.length}
      </div>

      <div class="flex flex-wrap gap-x-4 gap-y-3 text-2xl font-mono max-w-3xl">
        <For each={state.words}>
          {(word, i) => (
            <Word
              target={word}
              input={typedWords()[i()] ?? ""}
              isActive={i() === currentIndex()}
            />
          )}
        </For>
      </div>

      <Show when={state.status === "finished"}>
        <div class="flex flex-col items-center gap-4 mt-8">
          <div class="text-lg">
            <span class="text-(--text)">{state.metrics.correctedWpm}</span> wpm
            <span class="mx-3 text-(--sub)">|</span>
            <span class="text-(--sub)">{state.metrics.rawWpm}</span> raw
            <span class="mx-3 text-(--sub)">|</span>
            <span class="text-(--main)">{state.metrics.accuracy}%</span> acc
          </div>
          <button
            onClick={reset}
            class="px-4 py-2 bg-(--sub-alt) text-(--text) rounded hover:opacity-80"
          >
            Retry
          </button>
        </div>
      </Show>

      <button
        onClick={() => inputRef?.focus()}
        class="mt-4 px-4 py-2 bg-(--sub-alt) text-(--sub) rounded text-sm hover:text-(--text)"
      >
        focus
      </button>

      <input
        ref={inputRef}
        type="text"
        class="absolute -left-[9999px] opacity-0"
        value={state.input}
        onInput={(e) => onInput(e.currentTarget.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape") reset();
        }}
        autofocus
      />
    </div>
  );
}
