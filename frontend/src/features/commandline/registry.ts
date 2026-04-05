import { themes } from '@/features/content/themes/registry'
import { wordBanks } from '@/features/content/word-banks/registry'
import type { WordBankId } from '@/features/content/word-banks/types'
import { gameRegistry } from '@/features/games/registry'
import type { ThemeName } from '@/features/content/themes/types'
import type { CommandlineItem, CommandlineProps, CommandlineScope } from '@/features/commandline/types'

export function createCommandlineRegistry(
  props: CommandlineProps,
  setScope: (scope: CommandlineScope) => void,
): Record<CommandlineScope, CommandlineItem[]> {
  return {
    root: [
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
    ],
    navigate: [
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
    ],
    games: gameRegistry.map((game) => ({
      id: `game-${game.id}`,
      label: game.name,
      keywords: [game.name, game.id, game.description, game.status],
      active: props.selectedGameId === game.id,
      onSelect: () => props.onSelectGame(game.id),
    })),
    themes: (Object.keys(themes) as ThemeName[]).map((themeName) => ({
      id: `theme-${themeName}`,
      label: themeName.replace(/_/g, ' '),
      keywords: [themeName, 'theme', 'color'],
      active: props.currentThemeName === themeName,
      onSelect: () => props.onSelectTheme(themeName),
    })),
    'word-banks': (Object.entries(wordBanks) as [WordBankId, (typeof wordBanks)[WordBankId]][]).map(
      ([id, wordBank]) => ({
        id: `word-bank-${id}`,
        label: wordBank.label,
        keywords: [wordBank.label, wordBank.language, wordBank.variant, id],
        active: props.selectedWordBankId === id,
        onSelect: () => props.onSelectWordBank(id),
      }),
    ),
  }
}
