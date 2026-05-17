import { useAuthSession } from "@/features/auth/hooks";
import { useCreateResultMutation } from "@/features/users/results/api";
import { toast } from "@/lib/toast";
import type { DifficultyKey } from "@/features/games/types";

export function useSubmitGameResult(minScores: Record<DifficultyKey, number>) {
  const auth = useAuthSession();
  const mutation = useCreateResultMutation();

  const submit = (result: {
    gameId: string;
    score: number;
    difficulty: DifficultyKey;
  }) => {
    if (!auth.isAuthenticated()) return;

    if (result.score < minScores[result.difficulty]) {
      toast.info(
        `Result not saved. Test too short. Minimum score for ${result.difficulty} is ${minScores[result.difficulty]}.`,
      );
      return;
    }

    mutation.mutate(result);
  };

  return submit;
}
