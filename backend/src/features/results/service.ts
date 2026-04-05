import {
  findResultsByUser,
  insertResult,
} from './repository'
import { serializeGameResult } from './serializers'
import type { CreateResultInput, ListUserResultsFilters } from './schema'

export const createResult = async (input: CreateResultInput) => {
  const result = await insertResult(input)

  return serializeGameResult(result)
}

export const getUserResults = async (filters: ListUserResultsFilters) => {
  const results = await findResultsByUser(filters)

  return results.map(serializeGameResult)
}
