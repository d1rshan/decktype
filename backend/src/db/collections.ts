import type { Collection } from 'mongodb'

import { db } from './client'

export type ResultDocument = {
  userId: string
  gameId: string
  score: number
  difficulty: string
  createdAt: Date
}

export type LeaderboardDocument = {
  userId: string
  displayName: string
  gameId: string
  difficulty: string
  bestScore: number
  bestResultAt: Date
}

export const resultsCollection: Collection<ResultDocument> =
  db.collection<ResultDocument>('results')

export const leaderboardCollection: Collection<LeaderboardDocument> =
  db.collection<LeaderboardDocument>('leaderboard')
