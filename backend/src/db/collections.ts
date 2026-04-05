import type { Collection } from 'mongodb'

import { db } from './client'

export type GameResultDocument = {
  userId: string
  gameId: string
  score: number
  difficulty: string
  createdAt: Date
}

export const resultsCollection: Collection<GameResultDocument> =
  db.collection<GameResultDocument>('typing_results')
