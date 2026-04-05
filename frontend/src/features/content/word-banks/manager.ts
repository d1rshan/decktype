import { wordBanks } from '@/features/content/word-banks/registry'
import type { WordBankId } from '@/features/content/word-banks/types'

export function getWordBank(wordBankId: WordBankId) {
  return wordBanks[wordBankId] ?? null
}
