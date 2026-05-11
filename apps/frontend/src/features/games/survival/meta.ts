import type { GameModule } from "@/features/games/types";
import SurvivalView from "./view";

export const survivalGameMeta: GameModule = {
  id: "survival",
  name: "Survival",
  description: "Type as fast as you can to survive without making mistakes.",
  defaultWordBankId: "english/core-1k",
  View: SurvivalView,
};
