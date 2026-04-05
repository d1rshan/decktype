import englishCore1kWords from './english/core-1k'
import type { WordBank, WordBankId } from '@/word-banks/types'

export const wordBanks: Record<WordBankId, WordBank> = {
  'english/core-1k': {
    language: 'english',
    variant: 'core-1k',
    label: 'english 1k',
    words: [...englishCore1kWords],
  },
}
