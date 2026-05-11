import type { Component } from "solid-js";
import type { WordBankId } from "@/features/content/word-banks/types";

export type GameViewProps = {
  wordBankId?: WordBankId | null;
};

export type GameId = "falling-words" | "survival";

export type GameModule = {
  id: GameId;
  name: string;
  description: string;
  defaultWordBankId: WordBankId;
  difficulties: string[];
  View: Component<GameViewProps>;
};
