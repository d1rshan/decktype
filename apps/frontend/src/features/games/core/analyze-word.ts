import type { CharacterState, AnalyzedCharacter } from "./types";

export function analyzeWord(
  target: string,
  input: string,
  isActive: boolean,
): AnalyzedCharacter[] {
  const result: AnalyzedCharacter[] = [];

  for (let i = 0; i < target.length; i++) {
    const targetChar = target[i]!;
    let state: CharacterState = "pending";

    if (i >= input.length) {
      if (isActive && i === input.length) {
        state = "active";
      }
    } else if (input[i] === targetChar) {
      state = "correct";
    } else {
      state = "incorrect";
    }

    result.push({ value: targetChar, state });
  }

  return result;
}
