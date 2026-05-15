import { meta as fallingWordsGame } from "@/features/games/falling-words";
import { meta as survivalGame } from "@/features/games/survival";
import type { GameId, GameModule } from "@/features/games/types";

export const games: Record<GameId, GameModule> = {
  "falling-words": fallingWordsGame,
  survival: survivalGame,
};

export const gameRegistry = Object.values(games);
