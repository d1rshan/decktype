export const primaryRoutes = [
  { label: 'Leaderboard', path: '/leaderboard' },
  { label: 'About', path: '/about' },
  { label: 'Settings', path: '/settings' },
] as const

export const gameSearchParam = 'game'

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

export function buildHomePath(gameId?: string | null) {
  if (!gameId) {
    return '/'
  }

  const params = new URLSearchParams()
  params.set(gameSearchParam, gameId)
  return `/?${params.toString()}`
}
