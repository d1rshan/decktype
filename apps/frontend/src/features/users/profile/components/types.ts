import type { PersonalBestsCards } from "@/features/users/pbs/components/personal-bests";
import type { ResultsTableUi } from "@/features/users/results/components/results-table";

export type ProfileData = {
  user: {
    id: string;
    username: string;
    image?: string;
    createdAt: string | Date;
  };
  pbs: Parameters<typeof PersonalBestsCards>[0]["pbs"];
  results: Parameters<typeof ResultsTableUi>[0]["results"];
};
