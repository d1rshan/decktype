import { Word } from "@/features/games/components/Word";
import type { FallingWord } from "../engine";

export type WordsProps = {
  ref?: (el: HTMLDivElement) => void;
  words: FallingWord[];
  currentInput: string;
  focusedWordId: number | null;
  onFieldClick: () => void;
};

export function Words(props: WordsProps) {
  return (
    <div
      ref={props.ref}
      class="absolute inset-0 z-0 h-full w-full cursor-text overflow-hidden bg-(--bg)"
      onClick={props.onFieldClick}
    >
      {props.words.map((word) => {
        const isFocused = word.id === props.focusedWordId;
        const isPrefixMatch =
          props.currentInput.length > 0 &&
          word.text.startsWith(props.currentInput);
        const isExactMatch =
          props.currentInput.length > 0 &&
          word.text === props.currentInput &&
          isFocused;

        return (
          <div
            class={`absolute font-mono text-2xl leading-tight tracking-tight transition-all duration-150 ${
              isExactMatch
                ? "text-(--main)"
                : isFocused
                  ? "text-(--sub)"
                  : isPrefixMatch
                    ? "text-(--sub) opacity-60"
                    : "text-(--sub) opacity-40"
            }`}
            style={{
              transform: `translate(${word.x}px, ${word.y}px) rotate(${word.rotation}deg)`,
            }}
          >
            <Word
              word={word.text}
              input={isFocused ? props.currentInput : ""}
              isActive={isFocused}
            />
          </div>
        );
      })}
    </div>
  );
}
