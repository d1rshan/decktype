import type { Treaty } from '@elysiajs/eden'
import { api } from '@/lib/api-client'

export type LeaderboardEntry = Treaty.Data<typeof api.leaderboard.get>[number]
export type LeaderboardDifficulty = 'easy' | 'medium' | 'hard'
