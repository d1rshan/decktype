export type CharacterState = "correct" | "incorrect" | "active" | "pending";

export type AnalyzedCharacter = {
  value: string;
  state: CharacterState;
};

export type GameStatus = "idle" | "running" | "finished";

export type KeystrokeEvent = {
  key: string;
  timestamp: number;
  wordIndex: number;
  charIndex: number;
  correct: boolean;
};

export type WordResult = {
  target: string;
  input: string;
  correct: boolean;
  errors: number;
  corrected: number;
};

export type GameMetrics = {
  rawWpm: number;
  correctedWpm: number;
  accuracy: number;
  errorRate: number;
  keystrokes: KeystrokeEvent[];
  wordResults: WordResult[];
  startTime: number | null;
  endTime: number | null;
};

export type GameState = {
  status: GameStatus;
  words: string[];
  input: string;
  metrics: GameMetrics;
};
