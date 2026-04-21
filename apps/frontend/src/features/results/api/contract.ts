import { api } from '@/lib/api-client'

type RawCreateResultInput = Parameters<typeof api.results.post>[0]

export type CreateResultInput = Omit<RawCreateResultInput, 'gameId'> & {
  gameId: string
}
