import englishCore1kWords from './english/core-1k'
import type { WordBank } from './types'

export const wordBankRegistry: WordBank[] = [
  {
    id: 'english/core-1k',
    language: 'english',
    variant: 'core-1k',
    label: 'english 1k',
    words: [...englishCore1kWords],
  },
]
