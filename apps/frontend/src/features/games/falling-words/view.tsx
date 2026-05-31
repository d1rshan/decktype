import { Show } from "solid-js";

import type { GameViewProps } from "../core/types";
import { useSubmitGameResult } from "../core/hooks";
import { DifficultySelector } from "../core/components/difficulty-selector";
import { GameMeta } from "../core/components/game-meta";
import { GameOver } from "../core/components/game-over";
import { Field } from "./components/field";
import { Hud } from "./components/hud";
import { useEngine } from "./engine";
import { meta } from "./meta";

function View(props: GameViewProps) {
  const saveResult = useSubmitGameResult(meta.minScores);

  const {
    game: gameState,
    actions,
    wordBank,
  } = useEngine(props.wordBankId ?? meta.defaultWordBankId, {
    onComplete: saveResult,
  });

  return (
    <div class="flex flex-col gap-8">
      <div class="flex flex-col items-center gap-6">
        <DifficultySelector
          options={meta.difficultyKeys}
          activeDifficulty={gameState.difficulty()}
          onChange={actions.handleDifficultyChange}
        />

        <GameMeta wordBankLabel={wordBank.label} gameName={meta.name} />
      </div>

      <div class="relative min-h-[60vh] overflow-hidden rounded-2xl bg-(--sub-alt)/10 transition-all hover:bg-(--sub-alt)/20">
        <Show when={gameState.phase() === "game-over"}>
          <GameOver score={gameState.score()} />
        </Show>

        <Field
          ref={actions.setFieldRef}
          words={gameState.activeWords()}
          currentInput={gameState.currentInput()}
          focusedWordId={gameState.focusedWordId()}
          phase={gameState.phase()}
          onFieldClick={actions.focusInput}
        />

        <div class="pointer-events-none relative z-10 flex h-full min-h-[60vh] flex-col items-center justify-end px-10 pt-10 pb-6">
          <Show when={gameState.phase() !== "game-over"}>
            <Hud
              score={gameState.score()}
              typedValue={gameState.currentInput()}
            />
          </Show>
        </div>

        <input
          ref={actions.setInputRef}
          value={gameState.currentInput()}
          class="absolute -left-[9999px] top-0 opacity-0"
          autocapitalize="off"
          autocomplete="off"
          autocorrect="off"
          spellcheck={false}
          onInput={actions.handleInput}
          onKeyDown={actions.handleKeyDown}
        />
      </div>
    </div>
  );
}

export default View;
