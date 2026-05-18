import { onMount } from "solid-js";

type GameInputProps = {
  value: string;
  onInput: (value: string) => void;
  onNext: () => void;
  onPrevious: () => void;
  onReset: () => void;
};

export function GameInput(props: GameInputProps) {
  let ref: HTMLInputElement | undefined;

  onMount(() => ref?.focus());

  return (
    <input
      ref={ref}
      type="text"
      class="absolute -left-[9999px] opacity-0"
      value={props.value}
      onInput={(e) => props.onInput(e.currentTarget.value)}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          props.onReset();
          return;
        }

        if (e.key === " ") {
          e.preventDefault();
          props.onNext();
          return;
        }

        if (e.key === "Backspace" && props.value.length === 0) {
          e.preventDefault();
          props.onPrevious();
        }
      }}
    />
  );
}
