import { Index, createEffect, Show } from "solid-js";

export type WordsProps = {
  words: string[];
  currentWordIndex: number;
  currentInput: string;
  pastInputs: string[];
  onFieldClick: () => void;
};

function WordChars(props: { word: string; input: string; isActive: boolean }) {
  return (
    <Index each={props.word.split("")}>
      {(char, i) => {
        return (
          <span class="relative">
            <span
              class={
                !props.input[i]
                  ? props.isActive
                    ? "text-(--sub)/50"
                    : "text-(--error) opacity-70"
                  : props.input[i] === char()
                    ? "text-(--text)"
                    : "text-(--error)"
              }
            >
              <Show when={props.isActive && props.input.length === i}>
                <span class="absolute bottom-[-2px] left-0 h-[2px] w-full bg-(--caret) animate-pulse" />
              </Show>
              {char()}
            </span>
          </span>
        );
      }}
    </Index>
  );
}

function PastWord(props: { word: string; pastInput: string }) {
  return (
    <span class="inline-flex relative items-center text-(--text)">
      <WordChars word={props.word} input={props.pastInput} isActive={false} />
      <Show when={props.pastInput.length > props.word.length}>
        <span class="flex items-center text-(--error) opacity-80">
          {props.pastInput.slice(props.word.length)}
        </span>
      </Show>
    </span>
  );
}

function ActiveWord(props: { word: string; currentInput: string }) {
  return (
    <span class="inline-flex relative items-center text-(--text)">
      <WordChars word={props.word} input={props.currentInput} isActive={true} />

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
}

export function Words(props: WordsProps) {
  let containerRef: HTMLDivElement | undefined;

  createEffect(() => {
    if (containerRef && props.currentWordIndex >= 0) {
      const el = containerRef.querySelector(".active-word") as HTMLElement;
      if (el) {
        const scrollTo =
          el.offsetTop - containerRef.offsetHeight / 2 + el.offsetHeight / 2;
        containerRef.scrollTo({ top: scrollTo, behavior: "smooth" });
      }
    }
  });

  return (
    <div
      class="absolute inset-0 z-0 h-full w-full cursor-text overflow-hidden bg-(--bg)"
      onClick={props.onFieldClick}
    >
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
}
