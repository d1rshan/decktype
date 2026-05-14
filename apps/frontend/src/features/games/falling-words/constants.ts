import type { DifficultyKey } from "@/features/games/shared/types";

export type DifficultyConfig = {
  key: DifficultyKey;
  spawnIntervalMs: number;
  baseSpeed: number;
  speedJitter: number;
  gravity: number;
};

export const difficultyOptions: DifficultyConfig[] = [
  {
    key: "easy",
    spawnIntervalMs: 1800,
    baseSpeed: 68,
    speedJitter: 20,
    gravity: 6,
  },
  {
    key: "medium",
    spawnIntervalMs: 1250,
    baseSpeed: 94,
    speedJitter: 28,
    gravity: 9,
  },
  {
    key: "hard",
    spawnIntervalMs: 900,
    baseSpeed: 124,
    speedJitter: 36,
    gravity: 12,
  },
];

export const CHAR_WIDTH = 18;
export const BOTTOM_THRESHOLD = 40;
export const MAX_DELTA = 0.032;
