import { adminDAL } from './dal'
import { serializeUser } from './serializers'

export const getUsersCount = async () => {
  const count = await adminDAL.countUsers()

  return { count }
}

export const getUsersList = async () => {
  const docs = await adminDAL.listUsers(500)
  return docs.map((doc) => serializeUser(doc))
}
