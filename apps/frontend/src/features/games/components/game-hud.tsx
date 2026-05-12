import type { JSX } from "solid-js";

export type GameHudProps = {
  children: JSX.Element;
};

export function GameHud(props: GameHudProps) {
  return <div class="flex items-center gap-12 font-mono">{props.children}</div>;
}
