import { createSignal, createMemo, onCleanup, createEffect } from "solid-js";
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

/**
 * Calculates the Power-Weighted Score for the survival game.
 */
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

  const [phase, setPhase] = createSignal<GamePhase>("idle");
  const [difficulty, setDifficulty] = createSignal<DifficultyKey>("easy");

  const [health, setHealth] = createSignal(5);
  const [isShaking, setIsShaking] = createSignal(false);
  const [activeWords, setActiveWords] = createSignal<string[]>([]);
  const [pastInputs, setPastInputs] = createSignal<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = createSignal(0);
  const [currentInput, setCurrentInput] = createSignal("");

  const [totalCorrectChars, setTotalCorrectChars] = createSignal(0);
  const [totalTypedChars, setTotalTypedChars] = createSignal(0);
  const [totalErrors, setTotalErrors] = createSignal(0);
  const [elapsedMs, setElapsedMs] = createSignal(0);

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
    return calculateWpm(totalCorrectChars(), elapsedMs());
  });

  const accuracy = createMemo(() => {
    return calculateAccuracy(totalTypedChars(), totalErrors());
  });

  const score = createMemo(() => {
    return calculatePowerScore(totalCorrectChars(), wpm(), accuracy());
  });

  const stopTimer = () => {
    if (timerInterval !== undefined) {
      clearInterval(timerInterval);
      timerInterval = undefined;
    }
  };

  const endGame = () => {
    if (phase() === "game-over") return;
    setPhase("game-over");
    stopTimer();
    const finalElapsed = performance.now() - runStartTime;
    setElapsedMs(finalElapsed);

    const finalWpm = calculateWpm(totalCorrectChars(), finalElapsed);
    const finalAccuracy = calculateAccuracy(totalTypedChars(), totalErrors());
    const finalScore = calculatePowerScore(
      totalCorrectChars(),
      finalWpm,
      finalAccuracy,
    );

    options.onComplete?.({
      gameId: "survival",
      score: finalScore,
      difficulty: difficulty(),
    });
  };

  const triggerShake = () => {
    setIsShaking(true);
    if (shakeTimeout !== undefined) clearTimeout(shakeTimeout);
    shakeTimeout = window.setTimeout(() => setIsShaking(false), 300);
  };

  const takeDamage = (count: number = 1) => {
    if (count <= 0) return;
    const dmg = getDamagePerTypo(difficulty()) * count;
    const newHealth = Math.max(0, health() - dmg);

    setTotalErrors((e) => e + count);

    if (phase() !== "game-over") {
      triggerShake();
    }

    setHealth(newHealth);
    if (newHealth <= 0 && phase() !== "game-over") {
      endGame();
    }
  };

  const resetGame = (nextDiff = difficulty()) => {
    stopTimer();
    setDifficulty(nextDiff);
    setPhase("idle");
    setHealth(5);
    setActiveWords(generateWords(50));
    setPastInputs([]);
    setCurrentWordIndex(0);
    setCurrentInput("");
    setTotalCorrectChars(0);
    setTotalTypedChars(0);
    setTotalErrors(0);
    setElapsedMs(0);
    runStartTime = 0;
    if (inputRef) {
      inputRef.value = "";
      inputRef.focus();
    }
  };

  const startGame = () => {
    setPhase("running");
    runStartTime = performance.now();
    timerInterval = window.setInterval(() => {
      setElapsedMs(performance.now() - runStartTime);
    }, 250);
  };

  const handleInput = (e: InputEvent & { currentTarget: HTMLInputElement }) => {
    if (phase() === "game-over" || phase() === "paused") {
      e.currentTarget.value = "";
      return;
    }

    if (phase() === "idle") {
      startGame();
    }

    const value = e.currentTarget.value;
    const targetWord = activeWords()[currentWordIndex()];

    if (!targetWord) return;

    if (
      e.inputType === "deleteContentBackward" ||
      e.inputType === "deleteContentForward" ||
      e.inputType === "deleteWordBackward" ||
      e.inputType === "deleteWordForward"
    ) {
      setCurrentInput(value);
      return;
    }

    // Every other input counts as a typed char
    setTotalTypedChars((t) => t + 1);

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

      setTotalCorrectChars((c) => c + correctCount + 1);
      setPastInputs((prev) => [...prev, typedWord]);
      setCurrentWordIndex((i) => i + 1);
      setCurrentInput("");
      e.currentTarget.value = "";

      if (currentWordIndex() > activeWords().length - 20) {
        setActiveWords((prev) => [...prev, ...generateWords(50)]);
      }
      return;
    }

    const newChar = value[value.length - 1];
    const expectedChar = targetWord[value.length - 1];

    if (newChar !== expectedChar && value.length > currentInput().length) {
      takeDamage(1);
    }

    setCurrentInput(value);
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
    if (activeWords().length === 0 && wordBank) {
      setActiveWords(generateWords(50));
    }
  });

  return {
    phase,
    difficulty,
    health,
    wpm,
    accuracy,
    score,
    isShaking,
    activeWords,
    pastInputs,
    currentWordIndex,
    currentInput,
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
