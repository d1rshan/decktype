import type { Collection } from 'mongodb'

import { db } from './client'
import type { GameResultDocument } from '../features/results/types'

export const resultsCollection: Collection<GameResultDocument> =
  db.collection<GameResultDocument>('typing_results')
