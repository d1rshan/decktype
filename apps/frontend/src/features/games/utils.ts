import type { WordBankId } from '@/features/content/word-banks/types'

import { games } from './registry'
import type { GameId } from './types'

export function getGameName(gameId: string) {
  const game = games[gameId as keyof typeof games]

  return game?.name ?? gameId
}

export function getHomeGamePath(gameId: GameId | null, wordBankId: WordBankId) {
  return gameId ? `/?game=${gameId}&wordBank=${wordBankId}` : '/'
}
