import { createMemo, onCleanup, createEffect } from "solid-js";
import { createStore } from "solid-js/store";
import { getWordBank } from "@/features/content/word-banks/manager";
import type { WordBankId } from "@/features/content/word-banks/types";
import type { DifficultyKey } from "@/features/games/falling-words/types";
import { calculateWpm, calculateAccuracy } from "@/features/games/metrics";

export type GamePhase = "idle" | "running" | "game-over" | "paused";

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
  health: 5,
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

function calculatePowerScore(
  totalCorrectChars: number,
  wpm: number,
  accuracy: number,
): number {
  return Math.floor((totalCorrectChars * wpm * accuracy) / 100);
}

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

  const getDamagePerTypo = (diff: DifficultyKey) => {
    switch (diff) {
      case "easy":
        return 0.5;
      case "medium":
        return 1.0;
      case "hard":
        return 2.5;
      default:
        return 1.0;
    }
  };

  const generateWords = (count: number) => {
    if (!wordBank || wordBank.words.length === 0) return [];
    return Array.from({ length: count }, () => {
      const idx = Math.floor(Math.random() * wordBank.words.length);
      return wordBank.words[idx] || "error";
    });
  };

  const wpm = createMemo(() => {
    return calculateWpm(state.totalCorrectChars, state.elapsedMs);
  });

  const accuracy = createMemo(() => {
    return calculateAccuracy(state.totalTypedChars, state.totalErrors);
  });

  const score = createMemo(() => {
    return calculatePowerScore(state.totalCorrectChars, wpm(), accuracy());
  });

  const stopTimer = () => {
    if (timerInterval !== undefined) {
      clearInterval(timerInterval);
      timerInterval = undefined;
    }
  };

  const endGame = () => {
    if (state.phase === "game-over") return;
    setState("phase", "game-over");
    stopTimer();
    const finalElapsed = performance.now() - runStartTime;
    setState("elapsedMs", finalElapsed);

    const finalWpm = calculateWpm(state.totalCorrectChars, finalElapsed);
    const finalAccuracy = calculateAccuracy(
      state.totalTypedChars,
      state.totalErrors,
    );
    const finalScore = calculatePowerScore(
      state.totalCorrectChars,
      finalWpm,
      finalAccuracy,
    );

    options.onComplete?.({
      gameId: "survival",
      score: finalScore,
      difficulty: state.difficulty,
    });
  };

  const triggerShake = () => {
    setState("isShaking", true);
    if (shakeTimeout !== undefined) clearTimeout(shakeTimeout);
    shakeTimeout = window.setTimeout(() => setState("isShaking", false), 300);
  };

  const takeDamage = (count: number = 1) => {
    if (count <= 0) return;
    const dmg = getDamagePerTypo(state.difficulty) * count;
    const newHealth = Math.max(0, state.health - dmg);

    setState("totalErrors", (e) => e + count);

    if (state.phase !== "game-over") {
      triggerShake();
    }

    setState("health", newHealth);
    if (newHealth <= 0 && state.phase !== "game-over") {
      endGame();
    }
  };

  const resetGame = (nextDiff = state.difficulty) => {
    stopTimer();
    runStartTime = 0;
    setState({
      ...INITIAL_STATE,
      difficulty: nextDiff,
      activeWords: generateWords(50),
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
    }, 250);
  };

  const handleInput = (e: InputEvent & { currentTarget: HTMLInputElement }) => {
    if (state.phase === "game-over" || state.phase === "paused") {
      e.currentTarget.value = "";
      return;
    }

    if (state.phase === "idle") {
      startGame();
    }

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

    // Every other input counts as a typed char
    setState("totalTypedChars", (t) => t + 1);

    if (value.endsWith(" ")) {
      const typedWord = value.trim();

      let correctCount = 0;
      for (let i = 0; i < targetWord.length; i++) {
        if (typedWord[i] === targetWord[i]) correctCount++;
      }

      const missedCount = targetWord.length - typedWord.length;
      if (missedCount > 0) {
        takeDamage(missedCount);
      }

      setState("totalCorrectChars", (c) => c + correctCount + 1);
      setState("pastInputs", (prev) => [...prev, typedWord]);
      setState("currentWordIndex", (i) => i + 1);
      setState("currentInput", "");
      e.currentTarget.value = "";

      if (state.currentWordIndex > state.activeWords.length - 20) {
        setState("activeWords", (prev) => [...prev, ...generateWords(50)]);
      }
      return;
    }

    const newChar = value[value.length - 1];
    const expectedChar = targetWord[value.length - 1];

    if (newChar !== expectedChar && value.length > state.currentInput.length) {
      takeDamage(1);
    }

    setState("currentInput", value);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Tab") {
      e.preventDefault();
      resetGame();
    } else if (e.key === "Escape") {
      e.preventDefault();
      resetGame();
    }
  };

  onCleanup(() => stopTimer());

  createEffect(() => {
    if (state.activeWords.length === 0 && wordBank) {
      setState("activeWords", generateWords(50));
    }
  });

  return {
    phase: () => state.phase,
    difficulty: () => state.difficulty,
    health: () => state.health,
    wpm,
    accuracy,
    score,
    isShaking: () => state.isShaking,
    activeWords: () => state.activeWords,
    pastInputs: () => state.pastInputs,
    currentWordIndex: () => state.currentWordIndex,
    currentInput: () => state.currentInput,
    wordBank,
    handleDifficultyChange: (diff: DifficultyKey) => resetGame(diff),
    handleInput,
    handleKeyDown,
    setInputRef: (el: HTMLInputElement) => {
      inputRef = el;
    },
    focusInput: () => inputRef?.focus(),
    resetGame,
  };
}
