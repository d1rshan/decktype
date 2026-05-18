import type { GameId, GameModule } from "@/features/games/core/types";

import { meta as survivalMeta } from "@/features/games/survival/meta";

export const games: Record<GameId, GameModule> = {
  survival: survivalMeta,
};

export const gameRegistry = Object.values(games);
