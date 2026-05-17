import type { AnalyzedCharacter, CharacterState } from "./types";

export function analyzeWord(
  expected: string,
  typed: string,
): AnalyzedCharacter[] {
  const result: AnalyzedCharacter[] = [];

  const max = Math.max(expected.length, typed.length);

  for (let i = 0; i < max; i++) {
    const expectedChar = expected[i];
    const typedChar = typed[i];

    // extra chars
    if (i >= expected.length) {
      result.push({
        value: typedChar!,
        state: "extra",
      });

      continue;
    }

    let state: CharacterState = "pending";

    if (typedChar != null) {
      state = typedChar === expectedChar ? "correct" : "incorrect";
    }

    result.push({
      value: expectedChar!,
      state,
    });
  }

  return result;
}
