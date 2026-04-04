import { wordBankRegistry } from './registry'
import type { WordBankId } from './types'

export function getWordBank(wordBankId: WordBankId) {
  return wordBankRegistry.find((wordBank) => wordBank.id === wordBankId) ?? null
}
