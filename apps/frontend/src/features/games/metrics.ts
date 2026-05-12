/**
 * Calculates Words Per Minute (WPM) based on standard typing test rules (5 characters = 1 word).
 *
 * @param totalCorrectChars The total number of correctly typed characters (including spaces).
 * @param elapsedMs The total elapsed time in milliseconds.
 * @returns The calculated WPM, rounded to the nearest integer.
 */
export function calculateWpm(
  totalCorrectChars: number,
  elapsedMs: number,
): number {
  const elapsedMinutes = elapsedMs / 60000;
  if (elapsedMinutes === 0) return 0;
  return Math.round(totalCorrectChars / 5 / elapsedMinutes);
}

/**
 * Calculates the accuracy percentage of a typing session.
 *
 * @param totalTypedChars The total number of characters typed by the user.
 * @param totalErrors The total number of incorrect characters typed.
 * @returns A decimal representing the accuracy (e.g., 0.95 for 95%). Minimum is 0.
 */
export function calculateAccuracy(
  totalTypedChars: number,
  totalErrors: number,
): number {
  if (totalTypedChars === 0) return 1;
  return Math.max(0, (totalTypedChars - totalErrors) / totalTypedChars);
}
