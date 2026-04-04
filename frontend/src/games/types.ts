import type { Component } from 'solid-js'
import type { WordBankId } from '../word-banks/types'

export type GameId = 'falling-words' | 'quote-race' | 'time-attack'

export type GameStatus = 'live' | 'coming-soon'

export type GameModule = {
  id: GameId
  name: string
  description: string
  status: GameStatus
  defaultWordBankId: WordBankId
  View: Component
}
