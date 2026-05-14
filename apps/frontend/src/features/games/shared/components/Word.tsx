import { For } from "solid-js";
import { Caret } from "./Caret";

export type WordProps = {
  word: string;
  input: string;
  isActive: boolean;
  untypedClass?: string;
};

export function Word(props: WordProps) {
  return (
    <span class="relative inline-flex items-center">
      {props.word.split("").map((char, i) => {
        const hasInput = i < props.input.length;
        const isCaretHere = props.isActive && i === props.input.length;

        return (
          <span
            class={`relative transition-colors duration-200 ${
              hasInput
                ? props.input[i] === char
                  ? "text-(--text)"
                  : "text-(--error)"
                : (props.untypedClass ?? "text-inherit")
            }`}
          >
            {isCaretHere && <Caret inline />}
            {char}
          </span>
        );
      })}

      {props.input.length > props.word.length && (
        <span class="flex items-center">
          <For each={props.input.slice(props.word.length).split("")}>
            {(char) => <span class="text-(--error) opacity-80">{char}</span>}
          </For>
          {props.isActive && <Caret />}
        </span>
      )}

      {props.isActive && props.input.length === props.word.length && <Caret />}
    </span>
  );
}
