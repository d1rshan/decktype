import { resultsCollection } from './collections'

const ensureResultsIndexes = async () => {
  await resultsCollection.createIndexes([
    {
      key: { userId: 1, createdAt: -1 },
      name: 'user_createdAt_desc',
    },
    {
      key: { gameId: 1, difficulty: 1, score: -1, createdAt: -1 },
      name: 'game_difficulty_score_desc',
    },
  ])
}

export const ensureDatabaseIndexes = async () => {
  await ensureResultsIndexes()
}
