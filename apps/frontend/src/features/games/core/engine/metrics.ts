import { createMemo, createSignal, onCleanup } from "solid-js";
import type { KeystrokeEvent, WordResult, GameMetrics } from "../types";

export function buildMetricsSnapshot(
  keystrokes: KeystrokeEvent[],
  wordResults: WordResult[],
  startTime: number,
  endTime: number,
): GameMetrics {
  const durationMinutes = (endTime - startTime) / 1000 / 60;

  const totalChars = keystrokes.length;

  const correctChars = keystrokes.filter((k) => k.correct).length;

  const rawWpm = Math.round(totalChars / 5 / durationMinutes);

  const correctedWpm = Math.round(correctChars / 5 / durationMinutes);

  const accuracy =
    totalChars === 0 ? 100 : Math.round((correctChars / totalChars) * 100);

  return {
    rawWpm,
    correctedWpm,
    accuracy,
    keystrokes,
    wordResults,
    startTime,
    endTime,
  };
}

export function createLiveMetrics(
  keystrokes: () => KeystrokeEvent[],
  startTime: () => number | null,
) {
  const [now, setNow] = createSignal(Date.now());

  const interval = setInterval(() => setNow(Date.now()), 1000);
  onCleanup(() => clearInterval(interval));

  return createMemo(() => {
    const start = startTime();
    if (!start) {
      return { rawWpm: 0, correctedWpm: 0, accuracy: 100 };
    }

    const allKeystrokes = keystrokes();
    now();

    const durationMinutes = (Date.now() - start) / 1000 / 60;

    if (durationMinutes <= 0) {
      return { rawWpm: 0, correctedWpm: 0, accuracy: 100 };
    }

    const totalChars = allKeystrokes.length;
    const correctChars = allKeystrokes.filter((k) => k.correct).length;

    const rawWpm = Math.round(totalChars / 5 / durationMinutes);
    const correctedWpm = Math.round(correctChars / 5 / durationMinutes);
    const accuracy =
      totalChars === 0 ? 100 : Math.round((correctChars / totalChars) * 100);

    return { rawWpm, correctedWpm, accuracy };
  });
}
