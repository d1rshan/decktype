export function calculateWpm(
  totalCorrectChars: number,
  elapsedMs: number,
): number {
  const elapsedMinutes = elapsedMs / 60000;
  if (elapsedMinutes === 0) return 0;
  return Math.round(totalCorrectChars / 5 / elapsedMinutes);
}

export function calculateAccuracy(
  totalTypedChars: number,
  totalErrors: number,
): number {
  if (totalTypedChars === 0) return 1;
  return Math.max(0, (totalTypedChars - totalErrors) / totalTypedChars);
}

export type GameMetrics = { wpm: number; accuracy: number };

export function getMetrics(
  totalCorrectChars: number,
  totalTypedChars: number,
  totalErrors: number,
  elapsedMs: number,
): GameMetrics {
  return {
    wpm: calculateWpm(totalCorrectChars, elapsedMs),
    accuracy: calculateAccuracy(totalTypedChars, totalErrors),
  };
}
