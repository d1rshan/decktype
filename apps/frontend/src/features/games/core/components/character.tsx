import type { CharacterState } from "../types";

type CharacterProps = {
  char: string;
  state: CharacterState;
};

const classes: Record<CharacterState, string> = {
  correct: "text-(--text)",
  incorrect: "text-(--error)",
  active: "text-(--sub) shadow-[inset_0_-2px_0_var(--caret)]",
  pending: "text-(--sub)",
};

export function Character(props: CharacterProps) {
  return <span class={classes[props.state]}>{props.char}</span>;
}
