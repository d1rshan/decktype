import type { DifficultyKey, GamePhase } from "@/features/games/types";
export type { DifficultyKey, GamePhase };

export type DifficultyConfig = {
  key: DifficultyKey;
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
