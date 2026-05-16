import type { KeystrokeEvent, WordResult, GameMetrics } from "./types";

export function calcRawWpm(
  keystrokes: KeystrokeEvent[],
  startTime: number,
  endTime: number,
): number {
  const minutes = (endTime - startTime) / 60_000;
  if (minutes <= 0) return 0;
  return Math.round(keystrokes.length / 5 / minutes);
}

export function calcCorrectedWpm(
  wordResults: WordResult[],
  startTime: number,
  endTime: number,
): number {
  const minutes = (endTime - startTime) / 60_000;
  if (minutes <= 0) return 0;
  const correctWords = wordResults.filter((w) => w.correct).length;
  return Math.round(correctWords / minutes);
}

export function calcAccuracy(keystrokes: KeystrokeEvent[]): number {
  if (keystrokes.length === 0) return 100;
  const correct = keystrokes.filter((k) => k.correct).length;
  return Math.round((correct / keystrokes.length) * 100);
}

export function buildMetricsSnapshot(
  keystrokes: KeystrokeEvent[],
  wordResults: WordResult[],
  startTime: number,
  endTime: number,
): GameMetrics {
  return {
    rawWpm: calcRawWpm(keystrokes, startTime, endTime),
    correctedWpm: calcCorrectedWpm(wordResults, startTime, endTime),
    accuracy: calcAccuracy(keystrokes),
    errorRate: 0,
    keystrokes,
    wordResults,
    startTime,
    endTime,
  };
}
