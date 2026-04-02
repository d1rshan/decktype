export const primaryRoutes = [
  { label: 'About', path: '/about' },
  { label: 'Settings', path: '/settings' },
] as const

export function normalizePath(pathname: string) {
  if (!pathname || pathname === '') {
    return '/'
  }

  const normalized = pathname.endsWith('/') && pathname !== '/'
    ? pathname.slice(0, -1)
    : pathname

  return normalized === '' ? '/' : normalized
}

export function isGameRoute(pathname: string) {
  return normalizePath(pathname).startsWith('/games/')
}

export function getGameSlugFromPath(pathname: string) {
  if (!isGameRoute(pathname)) {
    return null
  }

  return normalizePath(pathname).replace('/games/', '') || null
}
