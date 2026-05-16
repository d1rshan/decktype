import { createStore } from "solid-js/store";
import type { GameState, KeystrokeEvent, WordResult } from "./types";
import { buildMetricsSnapshot } from "./metrics";

function initMetrics() {
  return {
    rawWpm: 0,
    correctedWpm: 0,
    accuracy: 100,
    errorRate: 0,
    keystrokes: [] as KeystrokeEvent[],
    wordResults: [] as WordResult[],
    startTime: null as number | null,
    endTime: null as number | null,
  };
}

type GameConfig = {
  words: string[];
  isComplete: (state: GameState) => boolean;
};

export function createGameStore(config: GameConfig) {
  const [state, setState] = createStore<GameState>({
    status: "idle",
    words: config.words,
    input: "",
    metrics: initMetrics(),
  });

  function start() {
    if (state.status !== "idle") return;
    setState("status", "running");
    setState("metrics", "startTime", Date.now());
  }

  function finish() {
    if (state.status !== "running") return;
    const endTime = Date.now();
    setState("status", "finished");
    setState(
      "metrics",
      buildMetricsSnapshot(
        state.metrics.keystrokes,
        buildWordResults(state.words, state.input.split(" ")),
        state.metrics.startTime!,
        endTime,
      ),
    );
  }

  function reset() {
    setState("status", "idle");
    setState("input", "");
    setState("metrics", initMetrics());
  }

  function onInput(value: string) {
    if (state.status === "idle") start();
    if (state.status !== "running") return;

    setState("input", value);

    const typedWords = value.split(" ");
    const wordIndex = typedWords.length - 1;
    const currentTyped = typedWords[wordIndex] ?? "";
    const currentTarget = state.words[wordIndex] ?? "";
    const charIndex = currentTyped.length - 1;
    const lastChar = currentTyped[charIndex];

    if (lastChar !== undefined) {
      const event: KeystrokeEvent = {
        key: lastChar,
        timestamp: Date.now(),
        wordIndex,
        charIndex,
        correct: lastChar === currentTarget[charIndex],
      };
      setState("metrics", "keystrokes", (k) => [...k, event]);
    }

    if (config.isComplete(state)) finish();
  }

  return { state, onInput, reset, start, finish };
}

function buildWordResults(targets: string[], inputs: string[]): WordResult[] {
  return targets.map((target, i) => {
    const input = inputs[i] ?? "";
    const errors = [...target].filter((c, j) => input[j] !== c).length;
    return {
      target,
      input,
      correct: target === input,
      errors,
      corrected: 0,
    };
  });
}
