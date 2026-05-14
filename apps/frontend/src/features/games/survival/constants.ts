import type { DifficultyKey } from "@/features/games/types";

export const WORD_BATCH = 50;
export const WORD_REFILL_THRESHOLD = 20;
export const TIMER_INTERVAL = 250;
export const SHAKE_DURATION = 300;
export const INITIAL_HEALTH = 5;
export const DAMAGE: Record<DifficultyKey, number> = {
  easy: 0.5,
  medium: 1,
  hard: 2.5,
};
