import type { WithId } from 'mongodb'
import type { UserDocument } from '../../db/collections'

export const serializeUser = (doc: WithId<UserDocument>) => {
  return {
    id: doc._id.toString(),
    name: doc.name,
    email: doc.email,
    createdAt: doc.createdAt,
  }
}
