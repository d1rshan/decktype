import { createEffect, createMemo, createSignal, For, onCleanup, Show } from 'solid-js'
import { gameRegistry } from '../games/registry'
import type { GameId } from '../games/types'
import { cn } from '../shared/lib/cn'
import { wordBankRegistry } from '../word-banks/registry'
import type { WordBankId } from '../word-banks/types'
import { themes } from '../themes/registry'
import type { ThemeName } from '../themes/types'

type CommandScope = 'root' | 'navigate' | 'games' | 'word-banks' | 'themes'

type CommandItem = {
  id: string
  label: string
  keywords: string[]
  active?: boolean
  onSelect: () => void
}

type CommandCenterProps = {
  isOpen: boolean
  currentPath: string
  selectedGameId: GameId | null
  selectedWordBankId: WordBankId | null
  currentThemeName: ThemeName
  onClose: () => void
  onNavigate: (path: string) => void
  onSelectGame: (gameId: GameId | null) => void
  onSelectWordBank: (wordBankId: WordBankId) => void
  onSelectTheme: (themeName: ThemeName) => void
  onPreviewTheme: (themeName: ThemeName) => void
}

function scopeLabel(scope: Exclude<CommandScope, 'root'>) {
  if (scope === 'navigate') {
    return 'Navigate'
  }

  if (scope === 'games') {
    return 'Games'
  }

  if (scope === 'themes') {
    return 'Themes'
  }

  return 'Word Banks'
}

function TickIcon(props: { class?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      class={cn("h-4 w-4", props.class)}
    >
      <path
        fill-rule="evenodd"
        d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 0 1 1.04-.208Z"
        clip-rule="evenodd"
      />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      class="h-4 w-4 opacity-50"
    >
      <path
        fill-rule="evenodd"
        d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
        clip-rule="evenodd"
      />
    </svg>
  )
}

function ThemePreview(props: { themeName: ThemeName }) {
  const theme = () => themes[props.themeName]
  return (
    <div
      class="flex items-center gap-1.5 rounded-full px-2 py-1.5 shadow-sm"
      style={{ 'background-color': theme().bg }}
    >
      <div class="h-2.5 w-2.5 rounded-full" style={{ 'background-color': theme().main }} />
      <div class="h-2.5 w-2.5 rounded-full" style={{ 'background-color': theme().sub }} />
      <div class="h-2.5 w-2.5 rounded-full" style={{ 'background-color': theme().text }} />
    </div>
  )
}

function CommandCenter(props: CommandCenterProps) {
  let searchInputRef: HTMLInputElement | undefined
  const [query, setQuery] = createSignal('')
  const [selectedIndex, setSelectedIndex] = createSignal(0)
  const [scope, setScope] = createSignal<CommandScope>('root')

  const rootItems = createMemo<CommandItem[]>(() => [
    {
      id: 'group-navigate',
      label: 'Navigate',
      keywords: ['navigate', 'pages', 'routes', 'view'],
      onSelect: () => setScope('navigate'),
    },
    {
      id: 'group-games',
      label: 'Games',
      keywords: ['games', 'modes', 'select game'],
      onSelect: () => setScope('games'),
    },
    {
      id: 'group-word-banks',
      label: 'Word Banks',
      keywords: ['word banks', 'language', 'words', 'dictionary'],
      onSelect: () => setScope('word-banks'),
    },
    {
      id: 'group-themes',
      label: 'Themes',
      keywords: ['themes', 'colors', 'appearance', 'style'],
      onSelect: () => setScope('themes'),
    },
  ])

  const navigateItems = createMemo<CommandItem[]>(() => [
    {
      id: 'route-home',
      label: 'View Typing Page',
      keywords: ['home', 'typing page', 'main'],
      active: props.currentPath === '/' && !props.selectedGameId,
      onSelect: () => props.onNavigate('/'),
    },
    {
      id: 'route-leaderboard',
      label: 'View Leaderboards',
      keywords: ['leaderboard', 'scores', 'ranking'],
      active: props.currentPath === '/leaderboard',
      onSelect: () => props.onNavigate('/leaderboard'),
    },
    {
      id: 'route-about',
      label: 'View About Page',
      keywords: ['about', 'info', 'mission'],
      active: props.currentPath === '/about',
      onSelect: () => props.onNavigate('/about'),
    },
    {
      id: 'route-settings',
      label: 'View Settings Page',
      keywords: ['settings', 'preferences', 'config'],
      active: props.currentPath === '/settings',
      onSelect: () => props.onNavigate('/settings'),
    },
    {
      id: 'route-profile',
      label: 'View Account Page',
      keywords: ['profile', 'account', 'user'],
      active: props.currentPath === '/profile',
      onSelect: () => props.onNavigate('/profile'),
    },
  ])

  const gameItems = createMemo<CommandItem[]>(() =>
    gameRegistry.map((game) => ({
      id: `game-${game.id}`,
      label: game.name,
      keywords: [game.name, game.id, game.description, game.status],
      active: props.selectedGameId === game.id,
      onSelect: () => props.onSelectGame(game.id),
    })),
  )

  const wordBankItems = createMemo<CommandItem[]>(() =>
    wordBankRegistry.map((wordBank) => ({
      id: `word-bank-${wordBank.id}`,
      label: wordBank.label,
      keywords: [wordBank.label, wordBank.language, wordBank.variant, wordBank.id],
      active: props.selectedWordBankId === wordBank.id,
      onSelect: () => props.onSelectWordBank(wordBank.id),
    })),
  )

  const themeItems = createMemo<CommandItem[]>(() =>
    (Object.keys(themes) as ThemeName[]).map((themeName) => ({
      id: `theme-${themeName}`,
      label: themeName.replace(/_/g, ' '),
      keywords: [themeName, 'theme', 'color'],
      active: props.currentThemeName === themeName,
      onSelect: () => props.onSelectTheme(themeName),
    })),
  )

  const itemsForScope = createMemo<CommandItem[]>(() => {
    if (scope() === 'root') {
      return rootItems()
    }

    if (scope() === 'navigate') {
      return navigateItems()
    }

    if (scope() === 'games') {
      return gameItems()
    }

    if (scope() === 'themes') {
      return themeItems()
    }

    return wordBankItems()
  })

  const visibleItems = createMemo(() => {
    const normalizedQuery = query().trim().toLowerCase()

    if (!normalizedQuery) {
      return itemsForScope()
    }

    return itemsForScope().filter((item) =>
      [item.label, ...item.keywords]
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery),
    )
  })

  const isNestedScope = createMemo(() => scope() !== 'root')
  const headerLabel = createMemo(() =>
    isNestedScope() ? `${scopeLabel(scope() as Exclude<CommandScope, 'root'>).toLowerCase()}...` : 'Search...',
  )

  const stepBack = () => {
    if (query()) {
      setQuery('')
      setSelectedIndex(0)
      return
    }

    if (isNestedScope()) {
      setScope('root')
      setSelectedIndex(0)
      return
    }

    props.onClose()
  }

  createEffect(() => {
    if (scope() === 'themes' && props.isOpen) {
      const item = visibleItems()[selectedIndex()]
      if (item && item.id.startsWith('theme-')) {
        const themeName = item.id.replace('theme-', '') as ThemeName
        props.onPreviewTheme(themeName)
      }
    } else if (props.isOpen) {
      // Revert to confirmed theme when moving to other scopes
      props.onPreviewTheme(props.currentThemeName)
    }
  })

  createEffect(() => {
    if (!props.isOpen) {
      setQuery('')
      setSelectedIndex(0)
      setScope('root')
      return
    }

    setQuery('')
    setSelectedIndex(0)
    setScope('root')
    queueMicrotask(() => searchInputRef?.focus())
  })

  createEffect(() => {
    const maxIndex = visibleItems().length - 1
    if (selectedIndex() > maxIndex) {
      setSelectedIndex(Math.max(maxIndex, 0))
    }
  })

  createEffect(() => {
    if (!props.isOpen) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        stepBack()
        return
      }

      if (event.key === 'Backspace' && query() === '' && isNestedScope()) {
        event.preventDefault()
        stepBack()
        return
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault()
        setSelectedIndex((current) => {
          if (visibleItems().length === 0) {
            return 0
          }

          return (current + 1) % visibleItems().length
        })
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault()
        setSelectedIndex((current) => {
          if (visibleItems().length === 0) {
            return 0
          }

          return (current - 1 + visibleItems().length) % visibleItems().length
        })
      }

      if (event.key === 'Enter') {
        event.preventDefault()
        const item = visibleItems()[selectedIndex()]
        if (!item) {
          return
        }

        const previousScope = scope()
        item.onSelect()

        if (previousScope === scope()) {
          props.onClose()
        } else {
          setQuery('')
          setSelectedIndex(0)
          queueMicrotask(() => searchInputRef?.focus())
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    onCleanup(() => {
      window.removeEventListener('keydown', handleKeyDown)
    })
  })

  return (
    <Show when={props.isOpen}>
      <div
        class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[var(--bg)]/90 px-5"
        onClick={props.onClose}
      >
        <div class="w-full max-w-[450px]">
          <div
            class="overflow-hidden rounded-lg bg-[var(--sub-alt)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div class="flex items-center gap-3 px-4 py-2">
              <SearchIcon />
              <input
                ref={searchInputRef}
                value={query()}
                class="w-full bg-transparent text-base text-[var(--text)] outline-none placeholder:text-[var(--sub)]"
                placeholder={headerLabel()}
                onInput={(event) => {
                  setQuery(event.currentTarget.value)
                  setSelectedIndex(0)
                }}
              />
            </div>

            <div class="max-h-[50vh] overflow-y-auto">
              <Show
                when={visibleItems().length > 0}
                fallback={
                  <div class="px-4 py-6 text-center text-[var(--sub)]">
                    no results...
                  </div>
                }
              >
                <div class="flex flex-col">
                  <For each={visibleItems()}>
                    {(item, index) => {
                      const isFocused = () => index() === selectedIndex()
                      const isActive = () => Boolean(item.active)

                      return (
                        <button
                          type="button"
                          style={isFocused() ? {
                            "background-color": "var(--text)",
                            "color": "var(--sub-alt)"
                          } : {}}
                          class={cn(
                            'flex w-full items-center gap-3 px-4 py-1.5 text-left transition-colors outline-none',
                            !isFocused() && (isActive() ? 'text-[var(--text)]' : 'text-[var(--sub)]')
                          )}
                          onMouseEnter={() => setSelectedIndex(index())}
                          onClick={() => {
                            const previousScope = scope()
                            item.onSelect()

                            if (previousScope === scope()) {
                              props.onClose()
                            } else {
                              setQuery('')
                              setSelectedIndex(0)
                              queueMicrotask(() => searchInputRef?.focus())
                            }
                          }}
                        >
                          <div class="flex w-5 shrink-0 justify-center">
                            <Show when={isActive()}>
                              <TickIcon
                                class={isFocused() ? 'text-[var(--sub-alt)]' : 'text-[var(--main)]'}
                              />
                            </Show>
                          </div>
                          <div class="min-w-0 flex-1">
                            <div class="truncate text-sm">
                              {item.label}
                            </div>
                          </div>
                          <Show when={scope() === 'themes'}>
                            <ThemePreview
                              themeName={item.id.replace('theme-', '') as ThemeName}
                            />
                          </Show>
                        </button>
                      )
                    }}
                  </For>
                </div>
              </Show>
            </div>
          </div>
        </div>
      </div>
    </Show>
  )
}

export default CommandCenter
