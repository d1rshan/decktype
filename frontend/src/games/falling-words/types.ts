export type DifficultyKey = 'easy' | 'medium' | 'hard'

export type DifficultyConfig = {
  key: DifficultyKey
  label: string
  spawnIntervalMs: number
  baseSpeed: number
  speedJitter: number
  gravity: number
}

export type FallingWord = {
  id: number
  text: string
  x: number
  y: number
  velocityX: number
  velocityY: number
  rotation: number
  angularVelocity: number
}

export type GamePhase = 'idle' | 'running' | 'game-over'
