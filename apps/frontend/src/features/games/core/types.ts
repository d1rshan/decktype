import type { Component } from "solid-js";
import type { WordBankId } from "@/features/content/word-banks/types";

export type GameViewProps = {
  wordBankId?: WordBankId | null;
};

export type GameId = "falling-words" | "survival";

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
