import { createMemo, onCleanup } from "solid-js";
import { createStore } from "solid-js/store";
import { getWordBank } from "@/features/content/word-banks/manager";
import type { WordBankId } from "@/features/content/word-banks/types";
import type { DifficultyKey } from "@/features/games/core/types";
import { createLiveMetrics } from "@/features/games/core/engine/metrics";
import { createGameStore } from "@/features/games/core/engine/state-machine";
import { randomWord } from "@/features/games/core/utils";
import {
  WORD_BATCH,
  WORD_REFILL_THRESHOLD,
  INITIAL_HEALTH,
  DAMAGE,
  SHAKE_DURATION,
} from "./constants";

export type UseGameOptions = {
  onComplete?: (result: {
    gameId: string;
    score: number;
    difficulty: DifficultyKey;
  }) => void;
};

type GameState = {
  difficulty: DifficultyKey;
  health: number;
  isShaking: boolean;
};

export function useSurvivalGame(
  wordBankId: WordBankId,
  options: UseGameOptions = {},
) {
  const wordBank = getWordBank(wordBankId);

  const generateWords = (count: number) => {
    if (!wordBank || !wordBank.words.length) return [];
    return Array.from({ length: count }, () => randomWord(wordBank.words));
  };

  const initialWords = generateWords(WORD_BATCH);
  const store = createGameStore({
    words: initialWords,
    onKeystroke: (event) => {
      if (!event.correct) {
        takeDamage(1);
      }
    },
    onWordComplete: ({ expected, typed }) => {
      const missed = Math.max(0, expected.length - typed.length);
      if (missed > 0) takeDamage(missed);

      if (
        store.state.currentWordIndex >
        store.state.words.length - WORD_REFILL_THRESHOLD
      ) {
        store.appendWords(generateWords(WORD_BATCH));
      }
    },
  });

  const [gameState, setGameState] = createStore<GameState>({
    difficulty: "easy",
    health: INITIAL_HEALTH,
    isShaking: false,
  });

  let shakeTimeout: number | undefined;
  let inputRef: HTMLInputElement | undefined;

  const triggerShake = () => {
    setGameState("isShaking", true);
    if (shakeTimeout !== undefined) clearTimeout(shakeTimeout);
    shakeTimeout = window.setTimeout(
      () => setGameState("isShaking", false),
      SHAKE_DURATION,
    );
  };

  const takeDamage = (count: number = 1) => {
    if (count <= 0) return;
    const newHealth = Math.max(
      0,
      gameState.health - DAMAGE[gameState.difficulty] * count,
    );
    setGameState({ health: newHealth });
    if (store.state.status !== "finished") {
      triggerShake();
    }
    if (newHealth <= 0 && store.state.status !== "finished") {
      store.finish();
      options.onComplete?.({
        gameId: "survival",
        score: score(),
        difficulty: gameState.difficulty,
      });
    }
  };

  const metrics = createLiveMetrics(
    () => store.state.metrics.keystrokes,
    () => store.state.metrics.startTime,
  );

  const score = createMemo(() =>
    Math.floor(
      (store.state.metrics.wordResults.reduce(
        (acc, w) => acc + w.target.length - w.errors,
        0,
      ) *
        metrics().correctedWpm *
        metrics().accuracy) /
        100,
    ),
  );

  const resetGame = (nextDiff = gameState.difficulty) => {
    setGameState({
      difficulty: nextDiff,
      health: INITIAL_HEALTH,
      isShaking: false,
    });
    store.reset();
    store.appendWords(generateWords(WORD_BATCH));
    if (inputRef) {
      inputRef.value = "";
      inputRef.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      resetGame();
      return;
    }

    if (
      e.key === "Enter" &&
      (store.state.status === "idle" || store.state.status === "finished")
    ) {
      e.preventDefault();
      resetGame();
    }
  };

  const handleInput = (e: InputEvent & { currentTarget: HTMLInputElement }) => {
    if (store.state.status === "idle") {
      const input = e.currentTarget;
      if (input.form) {
        const submitEvent = new Event("submit", {
          bubbles: true,
          cancelable: true,
        });
        input.form.dispatchEvent(submitEvent);
      }
    }
  };

  onCleanup(() => {
    if (shakeTimeout !== undefined) clearTimeout(shakeTimeout);
  });

  return {
    game: {
      phase: () => store.state.status,
      difficulty: () => gameState.difficulty,
      health: () => gameState.health,
      isShaking: () => gameState.isShaking,
    },
    metrics: {
      wpm: () => metrics().correctedWpm,
      accuracy: () => metrics().accuracy,
      score,
    },
    store,
    wordBank,
    actions: {
      handleInput,
      handleKeyDown,
      handleDifficultyChange: (diff: DifficultyKey) => resetGame(diff),
      setInputRef: (el: HTMLInputElement) => {
        inputRef = el;
      },
      focusInput: () => inputRef?.focus(),
      resetGame,
    },
  };
}
