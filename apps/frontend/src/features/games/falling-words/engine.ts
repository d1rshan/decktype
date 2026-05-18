import type { DifficultyConfig, FallingWord } from "./types";

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function estimateWordWidth(text: string) {
  return Math.max(96, text.length * 18);
}

export function createFallingWord(
  id: number,
  width: number,
  words: string[],
  difficulty: DifficultyConfig,
) {
  const text = words[Math.floor(Math.random() * words.length)];
  if (!text) {
    throw new Error("createFallingWord requires at least one word");
  }
  const estimatedWidth = estimateWordWidth(text);
  const safeWidth = Math.max(width - estimatedWidth - 24, 24);
  const x = randomBetween(24, safeWidth);

  const word: FallingWord = {
    id,
    text,
    x,
    y: randomBetween(-120, -40),
    velocityX: randomBetween(-16, 16),
    velocityY: difficulty.baseSpeed + randomBetween(0, difficulty.speedJitter),
    rotation: randomBetween(-10, 10),
    angularVelocity: randomBetween(-12, 12),
  };

  return word;
}
