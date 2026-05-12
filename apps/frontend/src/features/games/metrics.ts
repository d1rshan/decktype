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
