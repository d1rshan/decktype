import { Show } from "solid-js";
import { useAuthSession } from "@/features/auth/hooks";
import type { GameViewProps } from "@/features/games/types";
import { useCreateResultMutation } from "@/features/users/results/api";
import { toast } from "@/lib/toast";
import { DifficultySelector } from "../components/difficulty-selector";
import { meta } from ".";
import { useEngine } from "./engine";
import { Hud } from "./components/hud";
import { Words } from "./components/words";
import { GameOver } from "@/features/games/components/game-over";
import { GameInput } from "../components/game-input";
import { GameMeta } from "../components/game-meta";

import "./animations.css";

function View(props: GameViewProps) {
  const auth = useAuthSession();
  const createResultMutation = useCreateResultMutation();

  const session = useEngine(props.wordBankId ?? meta.defaultWordBankId, {
    onComplete: (result) => {
      if (!auth.isAuthenticated()) return;

      if (result.score < meta.minScores[result.difficulty]) {
        toast.info(
          `Result not saved. Test too short. Minimum score for ${result.difficulty} is ${meta.minScores[result.difficulty]}.`,
        );
        return;
      }

      createResultMutation.mutate(result);
    },
  });

  return (
    <div class="flex flex-col gap-8">
      <div class="flex flex-col items-center gap-6">
        <DifficultySelector
          options={meta.difficultyKeys}
          activeDifficulty={session.difficulty()}
          onChange={session.handleDifficultyChange}
        />
        <GameMeta
          wordBankLabel={session.wordBank?.label ?? meta.defaultWordBankId}
          gameName={meta.name}
        />
      </div>
      <div
        class={`relative min-h-[60vh] overflow-hidden rounded-2xl transition-colors hover:bg-(--sub-alt)/20 ${
          session.isShaking()
            ? "animate-damage bg-(--error)/10"
            : "bg-(--sub-alt)/10"
        }`}
      >
        <Show when={session.phase() === "game-over"}>
          <GameOver score={session.score()} />
        </Show>

        <Words
          words={session.activeWords()}
          currentWordIndex={session.currentWordIndex()}
          currentInput={session.currentInput()}
          pastInputs={session.pastInputs()}
          onFieldClick={session.focusInput}
        />

        <div class="pointer-events-none relative z-10 flex h-full flex-col items-center justify-between px-10 pt-10 pb-6">
          <div />
          <Hud
            health={session.health()}
            score={session.score()}
            wpm={session.wpm()}
            accuracy={session.accuracy()}
            isTakingDamage={session.isShaking()}
          />
        </div>
        <GameInput
          ref={session.setInputRef}
          value={session.currentInput()}
          onInput={session.handleInput}
          onKeyDown={session.handleKeyDown}
        />
      </div>
    </div>
  );
}

export default View;
