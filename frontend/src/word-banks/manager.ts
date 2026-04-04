import { wordBanks } from './registry'
import type { WordBankId } from './types'

export function getWordBank(wordBankId: WordBankId) {
  return wordBanks[wordBankId] ?? null
}
