import { Show } from "solid-js";
import type { GameViewProps } from "@/features/games/types";
import { meta } from ".";
import { useEngine } from "./engine";
import { useSubmitGameResult } from "@/features/games/hooks";
import { DifficultySelector } from "../components/difficulty-selector";
import { Hud } from "./components/hud";
import { Words } from "./components/words";
import { GameOver } from "@/features/games/components/game-over";
import { GameInput } from "../components/game-input";
import { GameMeta } from "../components/game-meta";

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
          <Hud
            health={game.health()}
            score={metrics.score()}
            wpm={metrics.wpm()}
            accuracy={metrics.accuracy()}
            isTakingDamage={game.isShaking()}
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

export default View;
