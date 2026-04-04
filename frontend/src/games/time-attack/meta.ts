import type { GameModule } from '../types'
import TimeAttackView from './view'

export const timeAttackGameMeta: GameModule = {
  id: 'time-attack',
  name: 'Time Attack',
  description: 'A short sprint mode tuned for raw speed and rapid resets.',
  status: 'coming-soon',
  defaultWordBankId: 'english/core-1k',
  View: TimeAttackView,
}
