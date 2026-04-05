export type LeaderboardEntry = {
  rank: number
  userId: string
  displayName: string
  gameId: string
  difficulty: string
  bestScore: number
  bestResultAt: string
}

export type LeaderboardDifficulty = 'easy' | 'medium' | 'hard'
