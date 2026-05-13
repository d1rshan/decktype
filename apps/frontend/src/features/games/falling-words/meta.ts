import type { GameModule } from "@/features/games/types";
import FallingWordsView from "./view";

export const fallingWordsGameMeta: GameModule = {
  id: "falling-words",
  name: "Falling Words",
  description: "Catch words before they hit the bottom of the screen.",
  defaultWordBankId: "english/core-1k",
  difficultyKeys: ["easy", "medium", "hard"] as const,
  minScores: { easy: 20, medium: 15, hard: 10 },
  View: FallingWordsView,
};
