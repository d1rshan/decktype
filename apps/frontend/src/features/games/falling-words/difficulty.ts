import type { DifficultyConfig, DifficultyKey } from "./types";

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

export const difficultyKeys: DifficultyKey[] = difficultyOptions.map(
  (option) => option.key,
);

export function getDifficulty(key: DifficultyKey): DifficultyConfig {
  return (
    difficultyOptions.find((option) => option.key === key) ??
    difficultyOptions[0]!
  );
}
