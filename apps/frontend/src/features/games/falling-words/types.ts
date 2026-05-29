export type DifficultyConfig = {
  spawnIntervalMs: number;
  baseSpeed: number;
  speedJitter: number;
  gravity: number;
};

export type FallingWord = {
  id: number;
  text: string;
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  rotation: number;
  angularVelocity: number;
};
