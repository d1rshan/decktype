import type { Component } from "solid-js";
import type { WordBankId } from "@/features/content/word-banks/types";

export type GameViewProps = {
  wordBankId?: WordBankId | null;
};

export type GameId = "survival";

export type DifficultyKey = "easy" | "medium" | "hard";

export type GamePhase = "idle" | "running" | "game-over";

export type GameModule = {
  id: GameId;
  name: string;
  description: string;
  defaultWordBankId: WordBankId;
  difficultyKeys: readonly DifficultyKey[];
  minScores: Record<DifficultyKey, number>;
  View: Component<GameViewProps>;
};

export type CharacterState = "correct" | "incorrect" | "pending" | "extra";

export type AnalyzedCharacter = {
  value: string;
  state: CharacterState;
};

export type WordState = {
  expected: string;
  typed: string;
};

export type GameStatus = "idle" | "running" | "finished";

export type KeystrokeEvent = {
  key: string;
  timestamp: number;
  wordIndex: number;
  charIndex: number;
  correct: boolean;
};

export type WordResult = {
  target: string;
  input: string;
  correct: boolean;
  errors: number;
};

export type GameMetrics = {
  rawWpm: number;
  correctedWpm: number;
  accuracy: number;
  keystrokes: KeystrokeEvent[];
  wordResults: WordResult[];
  startTime: number | null;
  endTime: number | null;
};

export type GameState = {
  status: GameStatus;
  words: WordState[];
  currentWordIndex: number;
  metrics: GameMetrics;
};
