import { onMount, onCleanup } from "solid-js";
import { useAuthSession } from "@/features/auth/hooks";
import { useCreateResultMutation } from "@/features/users/results/api";
import { toast } from "@/lib/toast";
import type { DifficultyKey } from "@/features/games/shared/types";

export function useAutoPause(onPause: () => void) {
  onMount(() => {
    const onBlur = () => onPause();
    const onVisibilityChange = () => {
      if (document.hidden) onPause();
    };

    window.addEventListener("blur", onBlur);
    document.addEventListener("visibilitychange", onVisibilityChange);

    onCleanup(() => {
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("visibilitychange", onVisibilityChange);
    });
  });
}

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
