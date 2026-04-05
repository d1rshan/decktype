import type { GameId } from '@/features/games/types'
import type { ThemeName } from '@/features/content/themes/types'
import type { WordBankId } from '@/features/content/word-banks/types'

export type CommandlineScope = 'root' | 'navigate' | 'games' | 'word-banks' | 'themes'

export type CommandlineItem = {
  id: string
  label: string
  keywords: string[]
  active?: boolean
  onSelect: () => void
}

export type CommandlineProps = {
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
