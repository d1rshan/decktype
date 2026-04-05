import type { Filter } from 'mongodb'

import { resultsCollection } from '../../db/collections'
import type {
  CreateGameResultInput,
  GameResultDocument,
  ListUserResultsFilters,
} from './types'

export const insertResult = async (input: CreateGameResultInput) => {
  const document: GameResultDocument = {
    ...input,
    createdAt: new Date(),
  }

  const insertedResult = await resultsCollection.insertOne(document)

  return {
    _id: insertedResult.insertedId,
    ...document,
  }
}

export const findResultsByUser = async (filters: ListUserResultsFilters) => {
  const query: Filter<GameResultDocument> = {
    userId: filters.userId,
    ...(filters.gameId ? { gameId: filters.gameId } : {}),
  }

  return resultsCollection
    .find(query, {
      sort: { createdAt: -1 },
      limit: filters.limit,
    })
    .toArray()
}
