import type { GameId, GameModule } from "@/features/games/types";

export const games: Record<GameId, GameModule> = {};

export const gameRegistry = Object.values(games);
