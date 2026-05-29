import type { DifficultyKey } from "@/features/games/types";

export type DifficultyConfig = {
  spawnIntervalMs: number;
  baseSpeed: number;
  speedJitter: number;
  gravity: number;
};

export type FallingWord = {
  id: number;
  text: string;
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  rotation: number;
  angularVelocity: number;
};

type CompletedGameResult = {
  gameId: "falling-words";
  score: number;
  difficulty: DifficultyKey;
};

export type UseFallingWordsGameOptions = {
  onComplete?: (result: CompletedGameResult) => void | Promise<void>;
};
