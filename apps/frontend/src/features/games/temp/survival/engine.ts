import { createMemo, onCleanup, createEffect } from "solid-js";
import { createStore } from "solid-js/store";
import { getWordBank } from "@/features/content/word-banks/manager";
import type { WordBankId } from "@/features/content/word-banks/types";
import type { DifficultyKey, GamePhase } from "@/features/games/types";
import { getMetrics } from "@/features/games/metrics";
import { randomWord } from "@/features/games/utils";

const WORD_BATCH = 50;
const WORD_REFILL_THRESHOLD = 20;
const TIMER_INTERVAL = 250;
const SHAKE_DURATION = 300;
const INITIAL_HEALTH = 5;
const DAMAGE: Record<DifficultyKey, number> = {
  easy: 0.5,
  medium: 1,
  hard: 2.5,
};

export type UseGameOptions = {
  onComplete?: (result: {
    gameId: string;
    score: number;
    difficulty: DifficultyKey;
  }) => void;
};

type GameState = {
  phase: GamePhase;
  difficulty: DifficultyKey;
  health: number;
  isShaking: boolean;
  activeWords: string[];
  pastInputs: string[];
  currentWordIndex: number;
  currentInput: string;
  totalCorrectChars: number;
  totalTypedChars: number;
  totalErrors: number;
  elapsedMs: number;
};

const INITIAL_STATE: GameState = {
  phase: "idle",
  difficulty: "easy",
  health: INITIAL_HEALTH,
  isShaking: false,
  activeWords: [],
  pastInputs: [],
  currentWordIndex: 0,
  currentInput: "",
  totalCorrectChars: 0,
  totalTypedChars: 0,
  totalErrors: 0,
  elapsedMs: 0,
};

export function useEngine(
  wordBankId: WordBankId,
  options: UseGameOptions = {},
) {
  const wordBank = getWordBank(wordBankId);

  const [state, setState] = createStore<GameState>({ ...INITIAL_STATE });

  let runStartTime = 0;
  let timerInterval: number | undefined;
  let shakeTimeout: number | undefined;
  let inputRef: HTMLInputElement | undefined;

  const generateWords = (count: number) => {
    if (!wordBank || !wordBank.words.length) return [];
    return Array.from({ length: count }, () => randomWord(wordBank.words));
  };

  const metrics = createMemo(() =>
    getMetrics(
      state.totalCorrectChars,
      state.totalTypedChars,
      state.totalErrors,
      state.elapsedMs,
    ),
  );

  const score = createMemo(() =>
    Math.floor(
      (state.totalCorrectChars * metrics().wpm * metrics().accuracy) / 100,
    ),
  );

  const stopTimer = () => {
    if (timerInterval !== undefined) {
      clearInterval(timerInterval);
      timerInterval = undefined;
    }
  };

  const triggerShake = () => {
    setState("isShaking", true);
    if (shakeTimeout !== undefined) clearTimeout(shakeTimeout);
    shakeTimeout = window.setTimeout(
      () => setState("isShaking", false),
      SHAKE_DURATION,
    );
  };

  const takeDamage = (count: number = 1) => {
    if (count <= 0) return;
    const newHealth = Math.max(
      0,
      state.health - DAMAGE[state.difficulty] * count,
    );
    setState({ totalErrors: state.totalErrors + count, health: newHealth });
    if (state.phase !== "game-over") triggerShake();
    if (newHealth <= 0 && state.phase !== "game-over") endGame();
  };

  const endGame = () => {
    if (state.phase === "game-over") return;
    stopTimer();
    const elapsed = performance.now() - runStartTime;
    setState({ phase: "game-over" as const, elapsedMs: elapsed });
    options.onComplete?.({
      gameId: "survival",
      score: score(),
      difficulty: state.difficulty,
    });
  };

  const resetGame = (nextDiff = state.difficulty) => {
    stopTimer();
    runStartTime = 0;
    setState({
      ...INITIAL_STATE,
      difficulty: nextDiff,
      activeWords: generateWords(WORD_BATCH),
    });
    if (inputRef) {
      inputRef.value = "";
      inputRef.focus();
    }
  };

  const startGame = () => {
    setState("phase", "running");
    runStartTime = performance.now();
    timerInterval = window.setInterval(() => {
      setState("elapsedMs", performance.now() - runStartTime);
    }, TIMER_INTERVAL);
  };

  const handleInput = (e: InputEvent & { currentTarget: HTMLInputElement }) => {
    if (state.phase === "game-over") {
      e.currentTarget.value = "";
      return;
    }

    if (state.phase === "idle") startGame();

    const value = e.currentTarget.value;
    const targetWord = state.activeWords[state.currentWordIndex];
    if (!targetWord) return;

    if (
      e.inputType === "deleteContentBackward" ||
      e.inputType === "deleteContentForward" ||
      e.inputType === "deleteWordBackward" ||
      e.inputType === "deleteWordForward"
    ) {
      setState("currentInput", value);
      return;
    }

    setState("totalTypedChars", (t) => t + 1);

    if (value.endsWith(" ")) {
      const input = value.trim();
      let correct = 0;
      for (let i = 0; i < targetWord.length; i++) {
        if (input[i] === targetWord[i]) correct++;
      }
      const missed = targetWord.length - input.length;
      setState({
        totalCorrectChars: state.totalCorrectChars + correct + 1,
        pastInputs: [...state.pastInputs, input],
        currentWordIndex: state.currentWordIndex + 1,
        currentInput: "",
      });
      if (missed > 0) takeDamage(missed);
      e.currentTarget.value = "";

      if (
        state.currentWordIndex >
        state.activeWords.length - WORD_REFILL_THRESHOLD
      ) {
        setState("activeWords", (prev) => [
          ...prev,
          ...generateWords(WORD_BATCH),
        ]);
      }
      return;
    }

    const newChar = value[value.length - 1];
    if (
      newChar !== targetWord[value.length - 1] &&
      value.length > state.currentInput.length
    ) {
      takeDamage(1);
    }

    setState("currentInput", value);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      resetGame();
      return;
    }

    if (
      e.key === "Enter" &&
      (state.phase === "idle" || state.phase === "game-over")
    ) {
      e.preventDefault();
      resetGame();
      startGame();
    }
  };

  onCleanup(() => stopTimer());

  createEffect(() => {
    if (state.activeWords.length === 0 && wordBank) {
      setState("activeWords", generateWords(WORD_BATCH));
    }
  });

  return {
    game: {
      phase: () => state.phase,
      difficulty: () => state.difficulty,
      health: () => state.health,
      isShaking: () => state.isShaking,
    },
    metrics: {
      wpm: () => metrics().wpm,
      accuracy: () => metrics().accuracy,
      score,
    },
    words: {
      activeWords: () => state.activeWords,
      pastInputs: () => state.pastInputs,
      currentWordIndex: () => state.currentWordIndex,
      currentInput: () => state.currentInput,
    },
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
