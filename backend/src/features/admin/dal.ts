import { usersCollection } from '../../db/collections'

export class AdminDAL {
  async countUsers() {
    return usersCollection.countDocuments()
  }

  async listUsers(limit = 500) {
    return usersCollection
      .find({}, { projection: { name: 1, email: 1, createdAt: 1 } })
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray()
  }
}

export const adminDAL = new AdminDAL()
