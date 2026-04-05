import { createEffect, createMemo, createSignal, onCleanup, onMount } from 'solid-js'
import ToastRegion from '@/app/components/toast-region'
import Commandline from '@/features/commandline/components/commandline'
import { games } from '@/features/games/registry'
import AboutPage from '@/pages/about-page'
import HomePage from '@/pages/home-page'
import LeaderboardPage from '@/pages/leaderboard-page'
import ProfilePage from '@/pages/profile-page'
import SettingsPage from '@/pages/settings-page'
import type { GameId } from '@/features/games/types'
import type { WordBankId } from '@/features/content/word-banks/types'
import {
  buildHomePath,
  getSelectedGameId,
  getSelectedWordBankId,
  normalizePath,
  primaryRoutes,
} from './routes'
import { themes } from '@/features/content/themes/registry'
import { applyTheme } from '@/features/content/themes/manager'
import type { ThemeName } from '@/features/content/themes/types'
import { authClient } from '@/lib/auth-client'

const THEME_STORAGE_KEY = 'decktype-theme'

function App() {
  const getCurrentLocation = () => ({
    path: normalizePath(window.location.pathname),
    search: window.location.search,
  })

  const getInitialTheme = (): ThemeName => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemeName
    if (saved && themes[saved]) {
      return saved
    }
    return 'carbon'
  }

  const [currentLocation, setCurrentLocation] = createSignal(getCurrentLocation())
  const [isCommandlineOpen, setIsCommandlineOpen] = createSignal(false)
  const [currentThemeName, setCurrentThemeName] = createSignal<ThemeName>(getInitialTheme())
  const session = authClient.useSession()
  const currentUserLabel = createMemo(() => session().data?.user.name ?? 'guest')

  const selectTheme = (name: ThemeName) => {
    setCurrentThemeName(name)
    applyTheme(themes[name])
    localStorage.setItem(THEME_STORAGE_KEY, name)
  }

  const previewTheme = (name: ThemeName) => {
    applyTheme(themes[name])
  }

  createEffect(() => {
    if (!isCommandlineOpen()) {
      // Re-apply the confirmed theme when the modal closes
      applyTheme(themes[currentThemeName()])
    }
  })

  const navigate = (target: string) => {
    const nextUrl = new URL(target, window.location.origin)
    const nextPath = normalizePath(nextUrl.pathname)
    const nextSearch = nextUrl.search
    const location = currentLocation()

    if (nextPath === location.path && nextSearch === location.search) {
      return
    }

    window.history.pushState({}, '', `${nextPath}${nextSearch}`)
    setCurrentLocation({ path: nextPath, search: nextSearch })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goHome = () => navigate('/')
  const selectedGameId = createMemo(
    () => getSelectedGameId(currentLocation().search) as GameId | null,
  )
  const selectedWordBankId = createMemo(
    () => (getSelectedWordBankId(currentLocation().search) || 'english/core-1k') as WordBankId,
  )
  const openGame = (gameId: GameId) => navigate(buildHomePath(gameId, selectedWordBankId()))
  const selectGameFromCommandline = (gameId: GameId | null) =>
    navigate(buildHomePath(gameId, selectedWordBankId()))
  const selectWordBankFromCommandline = (wordBankId: WordBankId) =>
    navigate(buildHomePath(selectedGameId(), wordBankId))

  createEffect(() => {
    const { path } = currentLocation()
    const gameId = selectedGameId()

    if (path !== '/' || !gameId) {
      return
    }

    if (games[gameId]) {
      return
    }

    window.history.replaceState({}, '', '/')
    setCurrentLocation({ path: '/', search: '' })
  })

  const currentPage = createMemo(() => {
    const { path, search } = currentLocation()

    if (path === '/') {
      return (
        <HomePage
          selectedGameId={getSelectedGameId(search) as GameId | null}
          selectedWordBankId={getSelectedWordBankId(search) as WordBankId | null}
          onSelectGame={openGame}
        />
      )
    }
    if (path === '/leaderboard') {
      return <LeaderboardPage />
    }
    if (path === '/profile') {
      return <ProfilePage onNavigate={navigate} />
    }
    if (path === '/about') {
      return <AboutPage />
    }
    if (path === '/settings') {
      return <SettingsPage />
    }

    return (
      <HomePage
        selectedGameId={null}
        selectedWordBankId={selectedWordBankId()}
        onSelectGame={openGame}
      />
    )
  })

  const handlePopState = () => {
    setCurrentLocation(getCurrentLocation())
  }

  onMount(() => {
    applyTheme(themes[currentThemeName()])

    const handleCommandlineShortcut = (event: KeyboardEvent) => {
      if (!(event.ctrlKey || event.metaKey) || event.key.toLowerCase() !== 'k') {
        return
      }

      event.preventDefault()
      setIsCommandlineOpen((current) => !current)
    }

    window.addEventListener('popstate', handlePopState)
    window.addEventListener('keydown', handleCommandlineShortcut)

    onCleanup(() => {
      window.removeEventListener('keydown', handleCommandlineShortcut)
    })
  })

  onCleanup(() => {
    window.removeEventListener('popstate', handlePopState)
  })

  return (
    <div class="relative min-h-screen bg-[var(--bg)] font-mono text-[var(--text)]">
      <Commandline
        isOpen={isCommandlineOpen()}
        currentPath={currentLocation().path}
        selectedGameId={selectedGameId()}
        selectedWordBankId={selectedWordBankId()}
        currentThemeName={currentThemeName()}
        onClose={() => setIsCommandlineOpen(false)}
        onNavigate={navigate}
        onSelectGame={selectGameFromCommandline}
        onSelectWordBank={selectWordBankFromCommandline}
        onSelectTheme={selectTheme}
        onPreviewTheme={previewTheme}
      />
      <ToastRegion />
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
                const isActive = currentLocation().path === route.path

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
              <span class="max-w-32 truncate text-xs font-bold uppercase tracking-widest">{currentUserLabel()}</span>
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
          <span>v1.0.0</span>
        </footer>
      </div>
    </div>
  )
}

export default App
