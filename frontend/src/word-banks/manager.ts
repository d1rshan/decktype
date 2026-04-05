import { wordBanks } from '@/word-banks/registry'
import type { WordBankId } from '@/word-banks/types'

export function getWordBank(wordBankId: WordBankId) {
  return wordBanks[wordBankId] ?? null
}
