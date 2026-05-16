export type CharacterState = "correct" | "incorrect" | "active" | "pending";

export type AnalyzedCharacter = {
  value: string;
  state: CharacterState;
};
