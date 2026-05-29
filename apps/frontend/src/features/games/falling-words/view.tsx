import { Show } from "solid-js";

import { useAuthSession } from "@/features/auth/hooks";
import { useCreateResultMutation } from "@/features/users/results/api";
import { toast } from "@/lib/toast";

import type { GameViewProps } from "../core/types";
import { DifficultySelector } from "../core/components/difficulty-selector";
import { GameMeta } from "../core/components/game-meta";
import FallingWordsField from "./components/falling-words-field";
import { FallingWordsHud as Hud } from "./components/falling-words-hud";
import { useFallingWordsGame } from "./use-falling-words-game";
import { meta } from "./meta";

function FallingWordsView(props: GameViewProps) {
  const auth = useAuthSession();
  const createResultMutation = useCreateResultMutation();
  const game = useFallingWordsGame(props.wordBankId ?? meta.defaultWordBankId, {
    onComplete: (result) => {
      if (!auth.isAuthenticated()) {
        return;
      }

      const minimumScore = meta.minScores[result.difficulty];

      if (result.score < minimumScore) {
        toast.info(
          `Result not saved. Test too short. Minimum score for ${result.difficulty} is ${minimumScore}.`,
        );
        return;
      }

      createResultMutation.mutate({
        gameId: result.gameId,
        score: result.score,
        difficulty: result.difficulty,
      });
    },
  });

  return (
    <div class="flex flex-col gap-8">
      <div class="flex flex-col items-center gap-6">
        <DifficultySelector
          options={meta.difficultyKeys}
          activeDifficulty={game.difficulty()}
          onChange={game.handleDifficultyChange}
        />

        <GameMeta wordBankLabel={game.wordBank.label} gameName={meta.name} />
      </div>

      <div class="relative min-h-[60vh] overflow-hidden rounded-2xl bg-(--sub-alt)/10 transition-all hover:bg-(--sub-alt)/20">
        <FallingWordsField
          ref={game.setFieldRef}
          words={game.activeWords()}
          currentInput={game.currentInput()}
          focusedWordId={game.focusedWordId()}
          phase={game.phase()}
          score={game.score()}
          onFieldClick={game.focusInput}
        />

        <div class="pointer-events-none relative z-10 flex h-full min-h-[60vh] flex-col items-center justify-end px-10 pt-10 pb-6">
          <Show when={game.phase() !== "game-over"}>
            <Hud score={game.score()} typedValue={game.currentInput()} />
          </Show>
        </div>

        <input
          ref={game.setInputRef}
          value={game.currentInput()}
          class="absolute -left-[9999px] top-0 opacity-0"
          autocapitalize="off"
          autocomplete="off"
          autocorrect="off"
          spellcheck={false}
          onInput={game.handleInput}
          onKeyDown={game.handleKeyDown}
        />
      </div>
    </div>
  );
}

export default FallingWordsView;
