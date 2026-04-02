import { createMemo, createSignal, onCleanup, onMount } from 'solid-js'
import AboutPage from '../pages/about/about-page'
import GamePage from '../pages/game/game-page'
import HomePage from '../pages/home/home-page'
import LeaderboardPage from '../pages/leaderboard/leaderboard-page'
import ProfilePage from '../pages/profile/profile-page'
import { getGameSlugFromPath, isGameRoute, normalizePath, primaryRoutes } from './routes'

function App() {
  const [currentPath, setCurrentPath] = createSignal(normalizePath(window.location.pathname))

  const navigate = (path: string) => {
    const nextPath = normalizePath(path)
    if (nextPath === currentPath()) {
      return
    }

    window.history.pushState({}, '', nextPath)
    setCurrentPath(nextPath)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goHome = () => navigate('/')
  const openGame = (slug: string) => navigate(`/games/${slug}`)

  const currentPage = createMemo(() => {
    const path = currentPath()

    if (path === '/') {
      return <HomePage onNavigate={navigate} onSelectGame={openGame} />
    }
    if (path === '/leaderboard') {
      return <div class="flex-1 flex items-center justify-center  italic">UNDER CONSTRUCTION...</div>
    }
    if (path === '/profile') {
      return <div class="flex-1 flex items-center justify-center  italic">UNDER CONSTRUCTION...</div>
    }
    if (path === '/about') {
      return <div class="flex-1 flex items-center justify-center  italic">UNDER CONSTRUCTION...</div>
    }
    if (path === '/settings') {
      return <div class="flex-1 flex items-center justify-center  italic">UNDER CONSTRUCTION...</div>
    }
    if (isGameRoute(path)) {
      const slug = getGameSlugFromPath(path)
      return slug ? <GamePage slug={slug} /> : <HomePage onNavigate={navigate} onSelectGame={openGame} />
    }

    return <HomePage onNavigate={navigate} onSelectGame={openGame} />
  })

  const handlePopState = () => {
    setCurrentPath(normalizePath(window.location.pathname))
  }

  onMount(() => {
    window.addEventListener('popstate', handlePopState)
  })

  onCleanup(() => {
    window.removeEventListener('popstate', handlePopState)
  })

  return (
    <div class="relative min-h-screen bg-[var(--bg)] font-mono text-[var(--text)]">
      <div class="mx-auto flex min-h-screen w-full flex-col px-24 py-8">
        <header class="mb-8 flex items-center justify-between">
          <div class="flex items-baseline gap-10">
            <button
              type="button"
              class="flex items-center group"
              onClick={goHome}
            >
              <span class="text-2xl font-bold tracking-tight text-[var(--text)]">decktype</span>
            </button>

            <nav class="flex items-center gap-8 text-sm">
              {primaryRoutes.map((route) => {
                const isActive = currentPath() === route.path

                return (
                  <button
                    type="button"
                    class={`transition ${isActive ? 'text-[var(--main)]' : 'text-[var(--sub)] hover:text-[var(--text)]'
                      }`}
                    onClick={() => navigate(route.path)}
                  >
                    {route.label.toLowerCase()}
                  </button>
                )
              })}
            </nav>
          </div>

          <div class="flex items-center text-[var(--sub)]">
            <button type="button" class="flex items-center gap-2 hover:text-[var(--text)] transition" onClick={() => navigate('/profile')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
              <span class="text-xs font-bold uppercase tracking-widest">guest</span>
            </button>
          </div>
        </header>

        <main class="flex-1 flex flex-col justify-center py-8">
          {currentPage()}
        </main>

        <footer class="mt-8 flex items-center justify-between text-xs text-[var(--sub)]">
          <div class="flex items-center gap-4">
            <a href="#" class="hover:text-[var(--text)]">
              contact
            </a>
            <a href="#" class="hover:text-[var(--text)]">support</a>
            <a href="#" class="hover:text-[var(--text)]">github</a>
            <a href="#" class="hover:text-[var(--text)]">discord</a>
          </div>
          <div class="flex items-center gap-4">
            <button type="button" class="flex items-center gap-1 hover:text-[var(--text)]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 2v20" /><path d="M2 12h20" /></svg>
              alduin
            </button>
            <span>v1.0.0</span>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default App
