import { createEffect, createMemo, onCleanup, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import { useAutoPause } from "@/features/games/shared/hooks";
import { getWordBank } from "@/features/content/word-banks/manager";
import type { WordBankId } from "@/features/content/word-banks/types";
import type { DifficultyKey, GamePhase } from "@/features/games/shared/types";
import {
  difficultyOptions,
  CHAR_WIDTH,
  BOTTOM_THRESHOLD,
  MAX_DELTA,
} from "./constants";
import type { DifficultyConfig } from "./constants";

export type FallingWord = {
  id: number;
  text: string;
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  rotation: number;
  angularVelocity: number;
};

type CompletedGameResult = {
  gameId: "falling-words";
  score: number;
  difficulty: DifficultyKey;
};

export type UseEngineOptions = {
  onComplete?: (result: CompletedGameResult) => void | Promise<void>;
};

function getDifficulty(key: DifficultyKey): DifficultyConfig {
  return difficultyOptions.find((o) => o.key === key) ?? difficultyOptions[0]!;
}

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function estimateWordWidth(text: string) {
  return Math.max(96, text.length * CHAR_WIDTH);
}

function createFallingWord(
  id: number,
  width: number,
  words: string[],
  difficulty: DifficultyConfig,
): FallingWord {
  const text = words[Math.floor(Math.random() * words.length)]!;
  const estimatedWidth = estimateWordWidth(text);
  const safeWidth = Math.max(width - estimatedWidth - 24, 24);

  return {
    id,
    text,
    x: randomBetween(24, safeWidth),
    y: randomBetween(-120, -40),
    velocityX: randomBetween(-16, 16),
    velocityY: difficulty.baseSpeed + randomBetween(0, difficulty.speedJitter),
    rotation: randomBetween(-10, 10),
    angularVelocity: randomBetween(-12, 12),
  };
}

function formatScore(elapsedMs: number) {
  return Math.floor(elapsedMs / 1000);
}

function findExactMatch(words: FallingWord[], value: string) {
  return words.filter((w) => w.text === value).sort((a, b) => b.y - a.y)[0];
}

type GameState = {
  phase: GamePhase;
  difficulty: DifficultyKey;
  fieldWidth: number;
  fieldHeight: number;
  activeWords: FallingWord[];
  currentInput: string;
  elapsedMs: number;
};

const INITIAL_STATE: GameState = {
  phase: "idle",
  difficulty: "easy",
  fieldWidth: 0,
  fieldHeight: 0,
  activeWords: [],
  currentInput: "",
  elapsedMs: 0,
};

export function useEngine(
  wordBankId: WordBankId,
  options: UseEngineOptions = {},
) {
  const wordBank = getWordBank(wordBankId);
  const [state, setState] = createStore<GameState>({ ...INITIAL_STATE });

  let inputRef: HTMLInputElement | undefined;
  let fieldRef: HTMLDivElement | undefined;
  let animationFrame = 0;
  let nextWordId = 1;
  let lastFrameTime = 0;
  let lastSpawnTime = 0;
  let runStartTime = 0;
  let elapsedBeforeRun = 0;

  const difficultyConfig = createMemo(() => getDifficulty(state.difficulty));

  const score = createMemo(() => formatScore(state.elapsedMs));

  const focusedWordId = createMemo((prevFocusedWordId?: number | null) => {
    const input = state.currentInput;
    const words = state.activeWords;

    if (input.length === 0) return null;

    if (prevFocusedWordId != null) {
      const prevWord = words.find((w) => w.id === prevFocusedWordId);
      if (prevWord?.text.startsWith(input)) return prevFocusedWordId;
    }

    const exactPrefixCandidates = words
      .filter((w) => w.text.startsWith(input))
      .sort((a, b) => b.y - a.y);

    if (exactPrefixCandidates.length > 0) {
      return exactPrefixCandidates[0]!.id;
    }

    let bestWordId: number | null = null;
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
    if (state.phase === "running" && runStartTime > 0) {
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
      setState({ fieldWidth: rect.width, fieldHeight: rect.height });
    }
  };

  const focusInput = () => {
    inputRef?.focus();
  };

  const spawnWord = () => {
    if (!wordBank || wordBank.words.length === 0) return;

    const word = createFallingWord(
      nextWordId,
      state.fieldWidth,
      wordBank.words,
      difficultyConfig(),
    );
    nextWordId += 1;
    setState("activeWords", (prev) => [...prev, word]);
  };

  const resetGame = (nextDifficulty = state.difficulty) => {
    stopLoop();
    setState({ ...INITIAL_STATE, difficulty: nextDifficulty });
    if (inputRef) {
      inputRef.value = "";
    }
    focusInput();
    lastFrameTime = 0;
    lastSpawnTime = 0;
    runStartTime = 0;
    elapsedBeforeRun = 0;
  };

  const startGame = () => {
    updateFieldSize();
    resetGame(state.difficulty);
    setState("phase", "running");
    runStartTime = performance.now();
    elapsedBeforeRun = 0;
    lastFrameTime = runStartTime;
    lastSpawnTime = runStartTime;
    spawnWord();
  };

  const pauseGame = () => {
    if (state.phase !== "running") return;

    elapsedBeforeRun = getElapsedMsNow();
    setState({ elapsedMs: elapsedBeforeRun, phase: "paused" });
    stopLoop();
  };

  // const resumeGame = () => {
  //   if (state.phase !== "paused") return;
  //
  //   runStartTime = performance.now();
  //   lastFrameTime = runStartTime;
  //   lastSpawnTime = runStartTime;
  //   setState("phase", "running");
  //   focusInput();
  // };

  const endGame = () => {
    const finalElapsedMs = getElapsedMsNow();
    const finalScore = formatScore(finalElapsedMs);
    setState({ phase: "game-over", elapsedMs: finalElapsedMs });
    stopLoop();
    void options.onComplete?.({
      gameId: "falling-words",
      score: finalScore,
      difficulty: state.difficulty,
    });
  };

  const submitExactMatch = (value: string, requireFocusMatch = false) => {
    const targetWord = findExactMatch(state.activeWords, value);
    if (!targetWord) return false;

    if (requireFocusMatch && targetWord.id !== focusedWordId()) return false;

    setState("activeWords", (prev) =>
      prev.filter((w) => w.id !== targetWord!.id),
    );
    setState("currentInput", "");
    if (inputRef) inputRef.value = "";
    return true;
  };

  const handleDifficultyChange = (nextDifficulty: DifficultyKey) => {
    if (state.phase === "running" || state.phase === "paused") {
      resetGame(nextDifficulty);
      return;
    }
    setState("difficulty", nextDifficulty);
  };

  const handleInput = (e: InputEvent & { currentTarget: HTMLInputElement }) => {
    const sanitized = e.currentTarget.value.replace(/\s+/g, "");

    if (state.phase === "idle" && sanitized.length > 0) {
      startGame();
      setState("currentInput", sanitized);
      submitExactMatch(sanitized, true);
      return;
    }

    if (state.phase !== "running") {
      e.currentTarget.value = "";
      return;
    }

    setState("currentInput", sanitized);
    submitExactMatch(sanitized, true);
  };

  const handleKeyDown = (
    e: KeyboardEvent & { currentTarget: HTMLInputElement },
  ) => {
    if (e.key === "Escape") {
      e.preventDefault();
      resetGame();
    }
  };

  createEffect(() => {
    if (state.phase !== "running") {
      stopLoop();
      return;
    }

    const tick = (timestamp: number) => {
      const deltaSeconds = Math.min(
        (timestamp - lastFrameTime) / 1000,
        MAX_DELTA,
      );
      lastFrameTime = timestamp;
      setState("elapsedMs", elapsedBeforeRun + (timestamp - runStartTime));

      const config = difficultyConfig();

      if (timestamp - lastSpawnTime >= config.spawnIntervalMs) {
        spawnWord();
        lastSpawnTime = timestamp;
      }

      let hitBottom = false;

      setState("activeWords", (prev) =>
        prev.map((word) => {
          const nextVY = word.velocityY + config.gravity * deltaSeconds;
          const nextX = word.x + word.velocityX * deltaSeconds;
          const maxX = Math.max(
            state.fieldWidth - word.text.length * CHAR_WIDTH - 36,
            24,
          );
          const bouncedX =
            nextX <= 20 || nextX >= maxX ? word.velocityX * -1 : word.velocityX;
          const clampedX = Math.min(Math.max(nextX, 20), maxX);
          const nextY = word.y + nextVY * deltaSeconds;
          const nextRotation =
            word.rotation + word.angularVelocity * deltaSeconds;

          if (
            state.fieldHeight > 0 &&
            nextY >= state.fieldHeight - BOTTOM_THRESHOLD
          ) {
            hitBottom = true;
          }

          return {
            ...word,
            x: clampedX,
            y: nextY,
            velocityX: bouncedX,
            velocityY: nextVY,
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

    const observer = new ResizeObserver(() => updateFieldSize());

    if (fieldRef) observer.observe(fieldRef);

    onCleanup(() => observer.disconnect());
  });

  useAutoPause(pauseGame);

  onCleanup(stopLoop);

  return {
    game: {
      phase: () => state.phase,
      difficulty: () => state.difficulty,
    },
    metrics: { score },
    words: {
      activeWords: () => state.activeWords,
      currentInput: () => state.currentInput,
      focusedWordId,
    },
    wordBank,
    actions: {
      handleInput,
      handleKeyDown,
      handleDifficultyChange,
      setInputRef: (el: HTMLInputElement) => {
        inputRef = el;
      },
      setFieldRef: (el: HTMLDivElement) => {
        fieldRef = el;
      },
      focusInput,
      resetGame,
    },
  };
}
