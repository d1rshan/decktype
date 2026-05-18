import { For, Show } from "solid-js";
import { useAuthSession } from "@/features/auth/hooks";
import type { GameViewProps } from "@/features/games/core/types";
import { useCreateResultMutation } from "@/features/users/results/api";
import { DifficultySelector } from "@/features/games/core/components/DifficultySelector";
import { GameMeta } from "@/features/games/core/components/GameMeta";
import { GameOver } from "@/features/games/core/components/GameOver";
import { Word } from "@/features/games/core/engine/Word";
import { useSurvivalGame } from "./use-survival-game";
import { SurvivalHud } from "./components/survival-hud";
import { meta } from "./meta";
import "@/features/games/survival/animations.css";

const DIFFICULTY_KEYS = meta.difficultyKeys;

export default function SurvivalView(props: GameViewProps) {
  const auth = useAuthSession();
  const createResultMutation = useCreateResultMutation();

  const game = useSurvivalGame(props.wordBankId ?? meta.defaultWordBankId, {
    onComplete: (result) => {
      if (!auth.isAuthenticated()) return;

      if (result.score < meta.minScores[result.difficulty]) {
        return;
      }

      createResultMutation.mutate({
        gameId: result.gameId,
        score: result.score,
        difficulty: result.difficulty,
      });
    },
  });

  if (!game.wordBank) {
    return (
      <div class="flex min-h-[60vh] items-center justify-center text-(--sub)">
        Missing word bank.
      </div>
    );
  }

  return (
    <div class="flex flex-col gap-8">
      <div class="flex flex-col items-center gap-6">
        <DifficultySelector
          options={DIFFICULTY_KEYS}
          activeDifficulty={game.game.difficulty()}
          onChange={game.actions.handleDifficultyChange}
        />

        <GameMeta wordBankLabel={game.wordBank.label} gameName={meta.name} />
      </div>

      <div
        class={[
          "relative min-h-[60vh] overflow-hidden rounded-2xl",
          "bg-(--sub-alt)/10 transition-all",
          game.game.isShaking() ? "animate-damage" : "",
        ].join(" ")}
        onClick={game.actions.focusInput}
      >
        <Show
          when={game.game.phase() === "running"}
          fallback={
            <div class="flex min-h-[60vh] items-center justify-center text-(--sub)">
              press any key to start
            </div>
          }
        >
          <div class="flex flex-wrap gap-y-3 px-10 py-16 text-2xl font-mono leading-tight tracking-tight max-w-3xl mx-auto">
            <For each={game.store.state.words}>
              {(word, i) => (
                <Word
                  word={word}
                  isActive={i() === game.store.state.currentWordIndex}
                />
              )}
            </For>
          </div>
        </Show>

        <div class="pointer-events-none absolute inset-x-0 bottom-10 z-10 flex justify-center">
          <SurvivalHud
            health={game.game.health()}
            score={game.metrics.score()}
            wpm={game.metrics.wpm()}
            accuracy={game.metrics.accuracy()}
          />
        </div>

        <GameOver score={game.metrics.score()} />

        <input
          ref={game.actions.setInputRef}
          value={game.store.currentWord()?.typed ?? ""}
          class="absolute -left-[9999px] top-0 opacity-0"
          autocapitalize="off"
          autocomplete="off"
          autocorrect="off"
          spellcheck={false}
          onInput={(e) => {
            game.actions.handleInput(e);
            game.store.onInput(e.currentTarget.value);
          }}
          onKeyDown={game.actions.handleKeyDown}
        />
      </div>
    </div>
  );
}
