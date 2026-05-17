import { createStore } from "solid-js/store";

import { buildMetricsSnapshot } from "./metrics";

import type { GameState, KeystrokeEvent, WordResult } from "./types";

type GameConfig = {
  words: string[];
};

function initMetrics() {
  return {
    rawWpm: 0,
    correctedWpm: 0,
    accuracy: 100,
    keystrokes: [] as KeystrokeEvent[],
    wordResults: [] as WordResult[],
    startTime: null as number | null,
    endTime: null as number | null,
  };
}

export function createGameStore(config: GameConfig) {
  const [state, setState] = createStore<GameState>({
    status: "idle",

    words: config.words.map((word) => ({
      expected: word,
      typed: "",
    })),

    currentWordIndex: 0,

    metrics: initMetrics(),
  });

  function currentWord() {
    return state.words[state.currentWordIndex];
  }

  function start() {
    if (state.status !== "idle") return;

    setState("status", "running");

    setState("metrics", "startTime", Date.now());
  }

  function finish() {
    if (state.status !== "running") return;

    const endTime = Date.now();
    // TODO: are we even setting endTime state ?

    const wordResults = buildWordResults(state.words);

    setState("status", "finished");

    setState(
      "metrics",
      buildMetricsSnapshot(
        state.metrics.keystrokes,
        wordResults,
        state.metrics.startTime!,
        endTime,
      ),
    );
  }

  function reset() {
    setState("status", "idle");

    setState(
      "words",
      config.words.map((word) => ({
        expected: word,
        typed: "",
      })),
    );

    setState("currentWordIndex", 0);

    setState("metrics", initMetrics());
  }

  function onInput(value: string) {
    if (state.status === "idle") {
      start();
    }

    if (state.status !== "running") {
      return;
    }

    const word = currentWord();

    if (!word) return;

    const previous = word.typed[word.typed.length - 1];

    const current = value[value.length - 1];

    // ignore deletions
    if (value.length < word.typed.length) {
      setState("words", state.currentWordIndex, "typed", value);

      return;
    }

    setState("words", state.currentWordIndex, "typed", value);

    if (current != null && current !== previous) {
      const charIndex = value.length - 1;

      const event: KeystrokeEvent = {
        key: current,
        timestamp: Date.now(),
        wordIndex: state.currentWordIndex,
        charIndex,
        correct: current === word!.expected[charIndex],
      };

      setState("metrics", "keystrokes", (k) => [...k, event]);
    }
  }

  function nextWord() {
    const isLastWord = state.currentWordIndex >= state.words.length - 1;

    if (isLastWord) {
      finish();
      return;
    }

    setState("currentWordIndex", (i) => i + 1);
  }

  function previousWord() {
    if (state.currentWordIndex <= 0) return;

    setState("currentWordIndex", (i) => i - 1);
  }

  return {
    state,
    currentWord,
    onInput,
    nextWord,
    previousWord,
    reset,
  };
}

function buildWordResults(
  words: {
    expected: string;
    typed: string;
  }[],
): WordResult[] {
  return words.map((word) => {
    const errors = [...word.expected].filter(
      (char, i) => word.typed[i] !== char,
    ).length;

    return {
      target: word.expected,
      input: word.typed,
      correct: word.expected === word.typed,
      errors,
    };
  });
}
