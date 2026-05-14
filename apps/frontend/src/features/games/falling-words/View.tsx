import { Show } from "solid-js";
import type { GameViewProps } from "@/features/games/shared/types";
import { useSubmitGameResult } from "@/features/games/shared/hooks";
import { Kbd } from "@/components/ui/kbd";
import { DifficultySelector } from "../shared/components/DifficultySelector";
import { GameMeta } from "../shared/components/GameMeta";
import { GameOver } from "../shared/components/GameOver";
import { GameInput } from "../shared/components/GameInput";
import meta from ".";
import { useEngine } from "./engine";
import { Words } from "./components/Words";
import { FallingWordsHud } from "./components/FallingWordsHud";

export function View(props: GameViewProps) {
  const saveResult = useSubmitGameResult(meta.minScores);

  const { game, metrics, words, actions, wordBank } = useEngine(
    props.wordBankId ?? meta.defaultWordBankId,
    { onComplete: saveResult },
  );

  if (!wordBank) {
    return (
      <div class="rounded-[2rem] border border-(--sub-alt) bg-(--sub-alt)/40 p-8 text-(--sub) backdrop-blur-xl">
        Missing word bank for this game.
      </div>
    );
  }

  return (
    <div class="flex flex-col gap-8">
      <div class="flex flex-col items-center gap-6">
        <DifficultySelector
          options={meta.difficultyKeys}
          activeDifficulty={game.difficulty()}
          onChange={actions.handleDifficultyChange}
        />
        <GameMeta wordBankLabel={wordBank.label} gameName={meta.name} />
      </div>

      <div class="relative min-h-[60vh] overflow-hidden rounded-2xl bg-(--sub-alt)/10 transition-all hover:bg-(--sub-alt)/20">
        <Show when={game.phase() === "idle"}>
          <div class="absolute inset-0 z-20 flex items-center justify-center p-6 text-center">
            <div class="flex items-center gap-2">
              <Kbd>escape</Kbd>
              <p class="text-base leading-normal">to start</p>
            </div>
          </div>
        </Show>

        <Show when={game.phase() === "paused"}>
          <div class="absolute inset-0 z-20 flex items-center justify-center bg-(--bg)/30 backdrop-blur-[2px]">
            <div class="text-center">
              <p class="text-xs leading-none font-bold uppercase tracking-widest text-(--sub)">
                paused
              </p>
              <p class="mt-4 text-6xl leading-none font-bold tracking-tighter text-(--main) sm:text-8xl">
                {metrics.score()}
              </p>
              <div class="mt-10 flex items-center justify-center gap-2">
                <Kbd>escape</Kbd>
                <p class="text-base leading-normal">to resume</p>
              </div>
            </div>
          </div>
        </Show>

        <Show when={game.phase() === "game-over"}>
          <GameOver score={metrics.score()} />
        </Show>

        <Words
          ref={actions.setFieldRef}
          words={words.activeWords()}
          currentInput={words.currentInput()}
          focusedWordId={words.focusedWordId()}
          onFieldClick={actions.focusInput}
        />

        <div class="pointer-events-none relative z-10 flex h-full min-h-[60vh] flex-col items-center justify-between px-10 pt-10 pb-6">
          <div />
          <FallingWordsHud
            score={metrics.score()}
            typedValue={words.currentInput()}
          />
        </div>

        <GameInput
          ref={actions.setInputRef}
          value={words.currentInput()}
          onInput={actions.handleInput}
          onKeyDown={actions.handleKeyDown}
        />
      </div>
    </div>
  );
}
