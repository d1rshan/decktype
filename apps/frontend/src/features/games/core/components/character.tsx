import type { CharacterState } from "../types";

type CharacterProps = {
  char: string;
  state: CharacterState;
};

const classes: Record<CharacterState, string> = {
  correct: "text-(--text)",
  incorrect: "text-(--error)",
  pending: "text-(--sub)",
  extra: "text-(--error)",
};

export function Character(props: CharacterProps) {
  return <span class={classes[props.state]}>{props.char}</span>;
}
