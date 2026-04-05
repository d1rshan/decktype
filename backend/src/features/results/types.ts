export type GameResultDocument = {
  userId: string
  gameId: string
  score: number
  difficulty: string
  createdAt: Date
}

export type CreateGameResultInput = {
  userId: string
  gameId: string
  score: number
  difficulty: string
}

export type ListUserResultsFilters = {
  userId: string
  gameId?: string
  limit: number
}

export type GameResultResponse = {
  id: string
  userId: string
  gameId: string
  score: number
  difficulty: string
  createdAt: string
}
