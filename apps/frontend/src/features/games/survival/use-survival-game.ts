import { createSignal, createMemo, onCleanup, createEffect } from "solid-js";
import { getWordBank } from "@/features/content/word-banks/manager";
import type { WordBankId } from "@/features/content/word-banks/types";
import type { DifficultyKey } from "@/features/games/falling-words/types";

export type GamePhase = "idle" | "running" | "game-over";

export type UseSurvivalGameOptions = {
  onComplete?: (result: {
    gameId: string;
    score: number;
    difficulty: DifficultyKey;
  }) => void;
};

export function useSurvivalGame(
  wordBankId: WordBankId,
  options: UseSurvivalGameOptions = {},
) {
  const wordBank = getWordBank(wordBankId);

  const [phase, setPhase] = createSignal<GamePhase>("idle");
  const [difficulty, setDifficulty] = createSignal<DifficultyKey>("easy");

  const [health, setHealth] = createSignal(5);
  const [activeWords, setActiveWords] = createSignal<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = createSignal(0);
  const [currentInput, setCurrentInput] = createSignal("");
  const [totalCorrectChars, setTotalCorrectChars] = createSignal(0);
  const [elapsedMs, setElapsedMs] = createSignal(0);

  let runStartTime = 0;
  let timerInterval: number | undefined;
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
    const elapsedMinutes = elapsedMs() / 60000;
    if (elapsedMinutes === 0) return 0;
    return Math.round(totalCorrectChars() / 5 / elapsedMinutes);
  });

  const stopTimer = () => {
    if (timerInterval !== undefined) {
      clearInterval(timerInterval);
      timerInterval = undefined;
    }
  };

  const endGame = () => {
    setPhase("game-over");
    stopTimer();
    const finalElapsed = performance.now() - runStartTime;
    setElapsedMs(finalElapsed);

    const finalWpm =
      finalElapsed > 0
        ? Math.round(totalCorrectChars() / 5 / (finalElapsed / 60000))
        : 0;

    options.onComplete?.({
      gameId: "survival",
      score: finalWpm,
      difficulty: difficulty(),
    });
  };

  const takeDamage = () => {
    const dmg = getDamagePerTypo(difficulty());
    const newHealth = Math.max(0, health() - dmg);
    setHealth(newHealth);
    if (newHealth <= 0) {
      endGame();
    }
  };

  const resetGame = (nextDiff = difficulty()) => {
    stopTimer();
    setDifficulty(nextDiff);
    setPhase("idle");
    setHealth(5);
    setActiveWords(generateWords(50));
    setCurrentWordIndex(0);
    setCurrentInput("");
    setTotalCorrectChars(0);
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
    if (phase() === "game-over") {
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
      e.currentTarget.value = currentInput();
      return;
    }

    if (value.endsWith(" ")) {
      const typedWord = value.trim();

      let correctCount = 0;
      for (let i = 0; i < targetWord.length; i++) {
        if (typedWord[i] === targetWord[i]) correctCount++;
      }

      setTotalCorrectChars((c) => c + correctCount + 1);
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

    if (newChar !== expectedChar) {
      takeDamage();
    }

    setCurrentInput(value);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      return;
    }

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
    activeWords,
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
