import { Show } from "solid-js";

import type { GameViewProps } from "../core/types";
import { useSubmitGameResult } from "../core/hooks";
import { DifficultySelector } from "../core/components/difficulty-selector";
import { GameOver } from "../core/components/game-over";
import { GameInput } from "../core/components/game-input";
import { GameMeta } from "../core/components/game-meta";
import { meta } from "./meta";
import { useEngine } from "./engine";
import { SurvivalHud as Hud } from "./components/survival-hud";
import { Words } from "./components/words";

import "./animations.css";

function View(props: GameViewProps) {
  const saveResult = useSubmitGameResult(meta.minScores);

  const { game, metrics, words, actions, wordBank } = useEngine(
    props.wordBankId ?? meta.defaultWordBankId,
    { onComplete: saveResult },
  );

  return (
    <div class="flex flex-col gap-8">
      <div class="flex flex-col items-center gap-6">
        <DifficultySelector
          options={meta.difficultyKeys}
          activeDifficulty={game.difficulty()}
          onChange={actions.handleDifficultyChange}
        />
        <GameMeta
          wordBankLabel={wordBank?.label ?? meta.defaultWordBankId}
          gameName={meta.name}
        />
      </div>
      <div
        class={`relative min-h-[60vh] overflow-hidden rounded-2xl transition-colors hover:bg-(--sub-alt)/20 ${
          game.isShaking()
            ? "animate-damage bg-(--error)/10"
            : "bg-(--sub-alt)/10"
        }`}
      >
        <Show when={game.phase() === "game-over"}>
          <GameOver score={metrics.score()} />
        </Show>

        <Words
          words={words.activeWords()}
          currentWordIndex={words.currentWordIndex()}
          currentInput={words.currentInput()}
          pastInputs={words.pastInputs()}
          onFieldClick={actions.focusInput}
        />

        <div class="pointer-events-none relative z-10 flex h-full flex-col items-center justify-between px-10 pt-10 pb-6">
          <div />
          <Show when={game.phase() !== "game-over"}>
            <Hud
              health={game.health()}
              score={metrics.score()}
              wpm={metrics.wpm()}
              accuracy={metrics.accuracy()}
              isTakingDamage={game.isShaking()}
            />
          </Show>
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

export default View;
