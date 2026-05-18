import type { GameModule } from "@/features/games/core/types";
import FallingWordsView from "./view";

export const meta: GameModule = {
  id: "falling-words" as const,
  name: "Falling Words",
  description: "Catch words before they hit the bottom of the screen.",
  defaultWordBankId: "english/core-1k",
  difficultyKeys: ["easy", "medium", "hard"] as const,
  minScores: { easy: 20, medium: 15, hard: 10 },
  View: FallingWordsView,
};
