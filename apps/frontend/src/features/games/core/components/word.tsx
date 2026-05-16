import { For } from "solid-js";
import { analyzeWord } from "../analyze-word";
import { Character } from "./character";

type WordProps = {
  target: string;
  input: string;
  isActive?: boolean;
};

export function Word(props: WordProps) {
  const analyzed = () =>
    analyzeWord(props.target, props.input, props.isActive ?? false);

  return (
    <div class="inline-flex">
      <For each={analyzed()}>
        {(char) => <Character char={char.value} state={char.state} />}
      </For>
    </div>
  );
}
