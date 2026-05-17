import type { CharacterState, AnalyzedCharacter } from "./types";

export function analyzeWord(
  target: string,
  input: string,
  isActive: boolean,
): AnalyzedCharacter[] {
  const result: AnalyzedCharacter[] = [];
  const len = Math.max(target.length, input.length);

  for (let i = 0; i < len; i++) {
    if (i >= target.length) {
      // extra characters beyond the target word
      result.push({ value: input[i]!, state: "incorrect" });
      continue;
    }

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
