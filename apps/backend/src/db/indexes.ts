import {
  feedbackCollection,
  leaderboardCollection,
  resultsCollection,
} from './collections'

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

const ensureLeaderboardIndexes = async () => {
  await leaderboardCollection.createIndexes([
    {
      key: { gameId: 1, difficulty: 1, userId: 1 },
      unique: true,
      name: 'game_difficulty_user_unique',
    },
    {
      key: { gameId: 1, difficulty: 1, bestScore: -1, createdAt: 1 },
      name: 'game_difficulty_best_score_desc',
    },
  ])
}

const ensureFeedbackIndexes = async () => {
  await feedbackCollection.createIndexes([
    {
      key: { createdAt: -1 },
      name: 'feedback_createdAt_desc',
    },
  ])
}

export const ensureDatabaseIndexes = async () => {
  await ensureResultsIndexes()
  await ensureLeaderboardIndexes()
  await ensureFeedbackIndexes()
}
