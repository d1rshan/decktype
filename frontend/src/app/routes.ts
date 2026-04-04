export const primaryRoutes = [
  { label: 'Leaderboard', path: '/leaderboard' },
  { label: 'About', path: '/about' },
  { label: 'Settings', path: '/settings' },
] as const

export const gameSearchParam = 'game'
export const wordBankSearchParam = 'wordBank'

export function normalizePath(pathname: string) {
  if (!pathname || pathname === '') {
    return '/'
  }

  const normalized = pathname.endsWith('/') && pathname !== '/'
    ? pathname.slice(0, -1)
    : pathname

  return normalized === '' ? '/' : normalized
}

export function getSelectedGameId(search: string) {
  const params = new URLSearchParams(search)
  return params.get(gameSearchParam)
}

export function getSelectedWordBankId(search: string) {
  const params = new URLSearchParams(search)
  return params.get(wordBankSearchParam)
}

export function buildHomePath(gameId?: string | null, wordBankId?: string | null) {
  const params = new URLSearchParams()

  if (gameId) {
    params.set(gameSearchParam, gameId)
  }

  if (wordBankId) {
    params.set(wordBankSearchParam, wordBankId)
  }

  const query = params.toString()
  return query ? `/?${query}` : '/'
}
