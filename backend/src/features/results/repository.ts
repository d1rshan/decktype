import type { Filter } from 'mongodb'

import { resultsCollection } from '../../db/collections'
import type { ResultDocument } from '../../db/collections'
import type { CreateResultInput, ListUserResultsFilters } from './schema'

export const insertResult = async (input: CreateResultInput) => {
  const document: ResultDocument = {
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
  const query: Filter<ResultDocument> = {
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
