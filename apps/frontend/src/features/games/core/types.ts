export type CharacterState = "correct" | "incorrect" | "pending" | "extra";

export type AnalyzedCharacter = {
  value: string;
  state: CharacterState;
};

export type WordState = {
  expected: string;
  typed: string;
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
};

export type GameMetrics = {
  rawWpm: number;
  correctedWpm: number;
  accuracy: number;
  keystrokes: KeystrokeEvent[];
  wordResults: WordResult[];
  startTime: number | null;
  endTime: number | null;
};

export type GameState = {
  status: GameStatus;
  words: WordState[];
  currentWordIndex: number;
  metrics: GameMetrics;
};
