import type { CharacterState } from "../types";

type CharacterProps = {
  char: string;
  state: CharacterState;
};

const classes: Record<CharacterState, string> = {
  correct: "text-green-500",
  incorrect: "text-red-500",
  active: "border-l border-blue-500",
  pending: "text-zinc-500",
};

export function Character(props: CharacterProps) {
  return <span class={classes[props.state]}>{props.char}</span>;
}
