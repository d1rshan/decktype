import type { GameModule } from "@/features/games/types";
import View from "./view";

export const meta: GameModule = {
  id: "survival",
  name: "Survival",
  description: "Type as fast as you can to survive without making mistakes.",
  defaultWordBankId: "english/core-1k",
  View: View,
};
