import type { KeystrokeEvent, WordResult, GameMetrics } from "./types";

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
