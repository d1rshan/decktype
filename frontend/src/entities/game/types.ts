export type GameId = 'falling-words' | 'quote-race' | 'time-attack'

export type GameDefinition = {
  id: GameId
  slug: string
  name: string
  description: string
  defaultLanguage: string
  status: 'live' | 'coming-soon'
}
