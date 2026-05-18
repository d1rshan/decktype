import type { GameId, GameModule } from "@/features/games/core/types";

import { meta as survivalMeta } from "@/features/games/survival/meta";
import { meta as fallingWordsMeta } from "@/features/games/falling-words/meta";

export const games: Record<GameId, GameModule> = {
  survival: survivalMeta,
  "falling-words": fallingWordsMeta,
};

export const gameRegistry = Object.values(games);
