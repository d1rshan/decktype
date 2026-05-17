import { Index, Show } from "solid-js";

import { analyzeWord } from "../analyze-word";
import type { WordState } from "../types";

import { Character } from "./character";

type WordProps = {
  word: WordState;
  isActive?: boolean;
};

export function Word(props: WordProps) {
  const chars = () => analyzeWord(props.word.expected, props.word.typed);

  return (
    <div class="inline-flex relative">
      <Index each={chars()}>
        {(char, i) => (
          <span class="relative">
            <Show when={props.isActive && i === props.word.typed.length}>
              <span class="absolute bottom-[-2px] left-0 h-[2px] w-full bg-(--caret) animate-pulse" />
            </Show>

            <Character char={char().value} state={char().state} />
          </span>
        )}
      </Index>

      <span class="relative inline-block w-[0.5em]">
        <Show
          when={
            props.isActive &&
            props.word.typed.length >= props.word.expected.length
          }
        >
          <span class="absolute bottom-[-2px] left-0 h-[2px] w-full bg-(--caret) animate-pulse" />
        </Show>
      </span>
    </div>
  );
}
