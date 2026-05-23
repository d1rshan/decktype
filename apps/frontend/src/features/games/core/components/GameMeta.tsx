import type { JSX } from "solid-js";
import { Globe, Keyboard } from "lucide-solid";

export type GameMetaItemProps = {
  icon: JSX.Element;
  label: string;
};

export function GameMetaItem(props: GameMetaItemProps) {
  return (
    <div class="flex items-center gap-2">
      {props.icon}
      <span class="text-xs leading-none font-semibold tracking-widest uppercase">
        {props.label}
      </span>
    </div>
  );
}

export type GameMetaProps = {
  wordBankLabel: string;
  gameName: string;
};

export function GameMeta(props: GameMetaProps) {
  return (
    <div class="flex items-center gap-6 text-(--sub)">
      <GameMetaItem
        icon={<Globe size={14} strokeWidth={2.5} class="opacity-50" />}
        label={props.wordBankLabel}
      />
      <GameMetaItem
        icon={<Keyboard size={14} strokeWidth={2.5} class="opacity-50" />}
        label={props.gameName.toLowerCase()}
      />
    </div>
  );
}
