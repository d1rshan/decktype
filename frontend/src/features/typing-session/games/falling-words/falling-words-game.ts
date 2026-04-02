import type { DifficultyConfig, DifficultyKey, FallingWord } from './types'

export const difficultyOptions: DifficultyConfig[] = [
  {
    key: 'easy',
    label: 'EASY',
    spawnIntervalMs: 1800,
    baseSpeed: 68,
    speedJitter: 20,
    gravity: 6,
  },
  {
    key: 'medium',
    label: 'MEDIUM',
    spawnIntervalMs: 1250,
    baseSpeed: 94,
    speedJitter: 28,
    gravity: 9,
  },
  {
    key: 'hard',
    label: 'HARD',
    spawnIntervalMs: 900,
    baseSpeed: 124,
    speedJitter: 36,
    gravity: 12,
  },
]

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min
}

function estimateWordWidth(text: string) {
  return Math.max(96, text.length * 18)
}

export function getDifficulty(key: DifficultyKey) {
  return difficultyOptions.find((option) => option.key === key) ?? difficultyOptions[0]
}

export function createFallingWord(
  id: number,
  width: number,
  words: string[],
  difficulty: DifficultyConfig,
) {
  const text = words[Math.floor(Math.random() * words.length)]
  const estimatedWidth = estimateWordWidth(text)
  const safeWidth = Math.max(width - estimatedWidth - 24, 24)
  const x = randomBetween(24, safeWidth)

  const word: FallingWord = {
    id,
    text,
    x,
    y: randomBetween(-120, -40),
    velocityX: randomBetween(-16, 16),
    velocityY: difficulty.baseSpeed + randomBetween(0, difficulty.speedJitter),
    rotation: randomBetween(-10, 10),
    angularVelocity: randomBetween(-12, 12),
  }

  return word
}
