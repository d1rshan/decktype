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

  const typedWords = () => state.input.split(" ");
  const currentIndex = () => typedWords().length - 1;

  return (
    <div class="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-8">
      <div class="text-sm text-zinc-400 mb-4">
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
            <span class="text-green-400">{state.metrics.correctedWpm}</span> wpm
            <span class="mx-3 text-zinc-600">|</span>
            <span class="text-blue-400">{state.metrics.rawWpm}</span> raw
            <span class="mx-3 text-zinc-600">|</span>
            <span class="text-yellow-400">{state.metrics.accuracy}%</span> acc
          </div>
          <button
            onClick={reset}
            class="px-4 py-2 bg-zinc-700 rounded hover:bg-zinc-600"
          >
            Retry
          </button>
        </div>
      </Show>

      <input
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
