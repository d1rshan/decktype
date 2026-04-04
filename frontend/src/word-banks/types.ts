export type WordBankId = 'english/core-1k'

export type WordBank = {
  id: WordBankId
  language: string
  variant: string
  label: string
  words: string[]
}
