import { For, Show } from "solid-js";

import { getWordBank } from "@/features/content/word-banks/manager";

import { randomWord } from "@/features/games/utils";

import { createGameStore } from "./engine/state-machine";

import { GameInput } from "./components/GameInput";
import { Word } from "./engine/Word";

const WORD_COUNT = 50;

const wordBank = getWordBank("english/core-1k");

const words = wordBank
  ? Array.from({ length: WORD_COUNT }, () => randomWord(wordBank.words))
  : [];

export function TypingTest() {
  const { state, currentWord, onInput, nextWord, previousWord, reset } =
    createGameStore({
      words,
    });

  return (
    <div class="flex flex-col items-center justify-center min-h-screen bg-(--bg) text-(--text) p-8">
      <div class="text-sm text-(--sub) mb-4">
        Word {state.currentWordIndex + 1} / {state.words.length}
      </div>

      <div class="flex flex-wrap  gap-y-3 text-2xl font-mono max-w-3xl">
        <For each={state.words}>
          {(word, i) => (
            <Word word={word} isActive={i() === state.currentWordIndex} />
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

      <GameInput
        value={currentWord()!.typed}
        onInput={onInput}
        onNext={nextWord}
        onPrevious={previousWord}
        onReset={reset}
      />
    </div>
  );
}
