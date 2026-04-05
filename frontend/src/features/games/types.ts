import type { Component } from 'solid-js'
import type { WordBankId } from '@/features/content/word-banks/types'

export type GameViewProps = {
  wordBankId?: WordBankId | null
}

export type GameId = 'falling-words'

export type GameStatus = 'live' | 'coming-soon'

export type GameModule = {
  id: GameId
  name: string
  description: string
  status: GameStatus
  defaultWordBankId: WordBankId
  View: Component<GameViewProps>
}
