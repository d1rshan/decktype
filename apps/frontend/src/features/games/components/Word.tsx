import { For } from "solid-js";

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
            {isCaretHere && (
              <span class="absolute bottom-[-2px] left-0 h-[2px] w-full bg-(--caret) animate-pulse" />
            )}
            {char}
          </span>
        );
      })}

      {props.input.length > props.word.length && (
        <span class="flex items-center">
          <For each={props.input.slice(props.word.length).split("")}>
            {(char) => <span class="text-(--error) opacity-80">{char}</span>}
          </For>
          {props.isActive && (
            <span class="ml-[1px] h-[2px] w-[0.6em] self-end bg-(--caret) animate-pulse mb-[2px]" />
          )}
        </span>
      )}

      {props.isActive && props.input.length === props.word.length && (
        <span class="ml-[1px] h-[2px] w-[0.6em] self-end bg-(--caret) animate-pulse mb-[2px]" />
      )}
    </span>
  );
}
