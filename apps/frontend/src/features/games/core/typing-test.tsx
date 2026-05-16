import { For } from "solid-js";
import { createStore } from "solid-js/store";
import { getWordBank } from "@/features/content/word-banks/manager";
import { randomWord } from "@/features/games/utils";
import { Word } from "./components/word";

const WORD_COUNT = 50;

const wordBank = getWordBank("english/core-1k");

export function TypingTest() {
  const [state, setState] = createStore({
    words: wordBank
      ? Array.from({ length: WORD_COUNT }, () => randomWord(wordBank.words))
      : [],
    input: "",
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

      <input
        type="text"
        class="absolute -left-[9999px] opacity-0"
        value={state.input}
        onInput={(e) => setState("input", e.currentTarget.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape") setState("input", "");
        }}
        autofocus
      />
    </div>
  );
}
