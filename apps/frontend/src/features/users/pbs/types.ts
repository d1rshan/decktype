type PB = {
  bestScore: number;
  createdAt: Date;
};

export type PBsByDifficulty = Record<string, PB>;

export type UserPBs = Record<string, PBsByDifficulty>;
