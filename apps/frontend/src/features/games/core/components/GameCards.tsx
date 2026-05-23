import { For } from "solid-js";
import { ArrowRight } from "lucide-solid";

import { gameRegistry } from "@/features/games/core/registry";
import type { GameId } from "@/features/games/core/types";

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

type GameCardsProps = {
  activeGameId?: GameId | null;
  onSelectGame: (gameId: GameId) => void;
};

export function GameCards(props: GameCardsProps) {
  return (
    <div class="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <For each={gameRegistry}>
        {(game) => (
          <GameCard
            id={game.id}
            name={game.name}
            description={game.description}
            onClick={() => props.onSelectGame(game.id)}
          />
        )}
      </For>
    </div>
  );
}
