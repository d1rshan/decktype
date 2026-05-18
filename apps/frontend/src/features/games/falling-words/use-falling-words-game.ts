import {
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
  onMount,
} from "solid-js";
import { getWordBank } from "@/features/content/word-banks/manager";
import type { WordBankId } from "@/features/content/word-banks/types";
import { getDifficulty } from "./difficulty";
import { createFallingWord } from "./engine";
import type {
  DifficultyKey,
  FallingWord,
  GamePhase,
  UseFallingWordsGameOptions,
} from "./types";

function formatScore(elapsedMs: number) {
  return Math.floor(elapsedMs / 1000);
}

function findExactMatch(words: FallingWord[], value: string) {
  return words
    .filter((word) => word.text === value)
    .sort((left, right) => right.y - left.y)[0];
}

export function useFallingWordsGame(
  wordBankId: WordBankId,
  options: UseFallingWordsGameOptions = {},
) {
  const wordBank = getWordBank(wordBankId);

  let inputRef: HTMLInputElement | undefined;
  let fieldRef: HTMLDivElement | undefined;
  let animationFrame = 0;
  let nextWordId = 1;
  let lastFrameTime = 0;
  let lastSpawnTime = 0;
  let runStartTime = 0;
  let elapsedBeforeRun = 0;

  const [phase, setPhase] = createSignal<GamePhase>("idle");
  const [difficulty, setDifficulty] = createSignal<DifficultyKey>("easy");
  const [fieldWidth, setFieldWidth] = createSignal(0);
  const [fieldHeight, setFieldHeight] = createSignal(0);
  const [activeWords, setActiveWords] = createSignal<FallingWord[]>([]);
  const [currentInput, setCurrentInput] = createSignal("");
  const [elapsedMs, setElapsedMs] = createSignal(0);

  const selectedDifficulty = createMemo(() => getDifficulty(difficulty()));
  const score = createMemo(() => formatScore(elapsedMs()));

  const focusedWordId = createMemo((prevFocusedWordId?: number | null) => {
    const input = currentInput();
    const words = activeWords();

    if (input.length === 0) {
      return null;
    }

    // Keep focus sticky if the previously focused word is still a valid exact prefix match
    if (prevFocusedWordId != null) {
      const prevWord = words.find((w) => w.id === prevFocusedWordId);
      if (prevWord && prevWord.text.startsWith(input)) {
        return prevFocusedWordId;
      }
    }

    // Try exact prefix match first
    const exactPrefixCandidates = words
      .filter((word) => word.text.startsWith(input))
      .sort((left, right) => right.y - left.y);

    if (exactPrefixCandidates.length > 0) {
      return exactPrefixCandidates[0]?.id ?? null;
    }

    // If no exact prefix match, find the word that HAS the longest prefix match with currentInput
    // This allows for mistakes at the end of the input while keeping focus
    let bestWordId = null;
    let longestPrefix = 0;
    let lowestY = -1;

    for (const word of words) {
      let prefixLen = 0;
      while (
        prefixLen < input.length &&
        prefixLen < word.text.length &&
        input.charAt(prefixLen) === word.text.charAt(prefixLen)
      ) {
        prefixLen++;
      }

      if (prefixLen > 0) {
        if (prefixLen > longestPrefix) {
          longestPrefix = prefixLen;
          bestWordId = word.id;
          lowestY = word.y;
        } else if (prefixLen === longestPrefix && word.y > lowestY) {
          bestWordId = word.id;
          lowestY = word.y;
        }
      }
    }

    return bestWordId;
  });

  const getElapsedMsNow = () => {
    if (phase() === "running" && runStartTime > 0) {
      return elapsedBeforeRun + (performance.now() - runStartTime);
    }

    return elapsedBeforeRun;
  };

  const stopLoop = () => {
    if (animationFrame) {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = 0;
    }
  };

  const updateFieldSize = () => {
    if (fieldRef) {
      const rect = fieldRef.getBoundingClientRect();
      setFieldWidth(rect.width);
      setFieldHeight(rect.height);
    }
  };

  const focusInput = () => {
    inputRef?.focus();
  };

  const spawnWord = () => {
    if (!wordBank || wordBank.words.length === 0) {
      return;
    }

    const nextWord = createFallingWord(
      nextWordId,
      fieldWidth(),
      wordBank.words,
      selectedDifficulty(),
    );
    nextWordId += 1;
    setActiveWords((current) => [...current, nextWord]);
  };

  const resetGame = (nextDifficulty = difficulty()) => {
    stopLoop();
    setDifficulty(nextDifficulty);
    setPhase("idle");
    setActiveWords([]);
    setCurrentInput("");
    if (inputRef) {
      inputRef.value = "";
    }
    focusInput();
    setElapsedMs(0);
    lastFrameTime = 0;
    lastSpawnTime = 0;
    runStartTime = 0;
    elapsedBeforeRun = 0;
  };

  const startGame = () => {
    updateFieldSize();
    resetGame(difficulty());
    setPhase("running");
    runStartTime = performance.now();
    elapsedBeforeRun = 0;
    lastFrameTime = runStartTime;
    lastSpawnTime = runStartTime;
    spawnWord();
  };

  const endGame = () => {
    const finalElapsedMs = getElapsedMsNow();
    const finalScore = formatScore(finalElapsedMs);
    setPhase("game-over");
    stopLoop();
    setElapsedMs(finalElapsedMs);
    void options.onComplete?.({
      gameId: "falling-words",
      score: finalScore,
      difficulty: difficulty(),
    });
  };

  const submitExactMatch = (value: string, requireFocusMatch = false) => {
    const targetWord = findExactMatch(activeWords(), value);
    if (!targetWord) {
      return false;
    }

    if (requireFocusMatch && targetWord.id !== focusedWordId()) {
      return false;
    }

    setActiveWords((current) =>
      current.filter((word) => word.id !== targetWord.id),
    );
    setCurrentInput("");
    if (inputRef) {
      inputRef.value = "";
    }
    return true;
  };

  const handleDifficultyChange = (nextDifficulty: DifficultyKey) => {
    if (phase() === "running") {
      resetGame(nextDifficulty);
      return;
    }

    setDifficulty(nextDifficulty);
  };

  const handleInput = (
    event: InputEvent & { currentTarget: HTMLInputElement },
  ) => {
    const sanitized = event.currentTarget.value.replace(/\s+/g, "");

    if (phase() === "idle" && sanitized.length > 0) {
      startGame();
      setCurrentInput(sanitized);
      submitExactMatch(sanitized, true);
      return;
    }

    if (phase() !== "running") {
      event.currentTarget.value = "";
      return;
    }

    setCurrentInput(sanitized);
    submitExactMatch(sanitized, true);
  };

  const handleKeyDown = (
    event: KeyboardEvent & { currentTarget: HTMLInputElement },
  ) => {
    if (event.key === "Escape") {
      event.preventDefault();
      resetGame();
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();

      if (phase() === "idle" || phase() === "game-over") {
        startGame();
      }
    }
  };

  const handleVisibilityChange = () => {
    if (document.hidden && phase() === "running") {
      endGame();
    }
  };

  const handleWindowBlur = () => {
    if (phase() === "running") {
      endGame();
    }
  };

  createEffect(() => {
    if (phase() !== "running") {
      stopLoop();
      return;
    }

    const tick = (timestamp: number) => {
      const deltaSeconds = Math.min((timestamp - lastFrameTime) / 1000, 0.032);
      lastFrameTime = timestamp;
      setElapsedMs(elapsedBeforeRun + (timestamp - runStartTime));

      const difficultyConfig = selectedDifficulty();

      if (timestamp - lastSpawnTime >= difficultyConfig.spawnIntervalMs) {
        spawnWord();
        lastSpawnTime = timestamp;
      }

      let hitBottom = false;

      setActiveWords((current) =>
        current.map((word) => {
          const nextVelocityY =
            word.velocityY + difficultyConfig.gravity * deltaSeconds;
          const nextX = word.x + word.velocityX * deltaSeconds;
          const maxX = Math.max(fieldWidth() - word.text.length * 18 - 36, 24);
          const bouncedX =
            nextX <= 20 || nextX >= maxX ? word.velocityX * -1 : word.velocityX;
          const clampedX = Math.min(Math.max(nextX, 20), maxX);
          const nextY = word.y + nextVelocityY * deltaSeconds;
          const nextRotation =
            word.rotation + word.angularVelocity * deltaSeconds;

          if (fieldHeight() > 0 && nextY >= fieldHeight() - 40) {
            hitBottom = true;
          }

          return {
            ...word,
            x: clampedX,
            y: nextY,
            velocityX: bouncedX,
            velocityY: nextVelocityY,
            rotation: nextRotation,
          };
        }),
      );

      if (hitBottom) {
        endGame();
        return;
      }

      animationFrame = window.requestAnimationFrame(tick);
    };

    animationFrame = window.requestAnimationFrame((timestamp) => {
      lastFrameTime = timestamp;
      tick(timestamp);
    });

    onCleanup(stopLoop);
  });

  onMount(() => {
    updateFieldSize();
    setTimeout(updateFieldSize, 100);
    focusInput();

    const observer = new ResizeObserver(() => {
      updateFieldSize();
    });

    if (fieldRef) {
      observer.observe(fieldRef);
    }

    window.addEventListener("blur", handleWindowBlur);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    onCleanup(() => {
      observer.disconnect();
      window.removeEventListener("blur", handleWindowBlur);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    });
  });

  onCleanup(() => {
    stopLoop();
  });

  return {
    activeWords,
    currentInput,
    difficulty,
    focusedWordId,
    handleDifficultyChange,
    handleInput,
    handleKeyDown,
    phase,
    score,
    setInputRef: (element: HTMLInputElement) => {
      inputRef = element;
    },
    setFieldRef: (element: HTMLDivElement) => {
      fieldRef = element;
    },
    focusInput,
    wordBank,
  };
}
