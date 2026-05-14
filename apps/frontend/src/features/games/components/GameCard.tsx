import { ArrowRight } from "lucide-solid";
import type { GameId } from "@/features/games/types";

type GameCardProps = {
  name: string;
  description: string;
  id: GameId;
  onClick: () => void;
};

export function GameCard(props: GameCardProps) {
  return (
    <button
      type="button"
      class="group relative flex flex-col items-start gap-6 rounded-2xl bg-(--sub-alt) p-10 text-left transition-all"
      onClick={props.onClick}
    >
      <div class="flex flex-col gap-3">
        <h2 class="text-2xl leading-tight font-bold transition-colors group-hover:text-(--main)">
          {props.name.toLowerCase()}
        </h2>
        <p class="text-base leading-normal text-(--sub)">
          {props.description.toLowerCase()}
        </p>
      </div>

      <div class="absolute bottom-10 right-10 translate-x-4 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100">
        <ArrowRight size={20} strokeWidth={3} class="text-(--main)" />
      </div>
    </button>
  );
}
