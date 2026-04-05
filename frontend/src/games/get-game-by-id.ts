import { gameRegistry } from '@/games/registry'

export function getGameById(gameId: string | null | undefined) {
  if (!gameId) {
    return null
  }

  return gameRegistry.find((game) => game.id === gameId) ?? null
}
