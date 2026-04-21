import { t } from 'elysia'
import { ObjectId } from 'mongodb'

export const TObjectId = t.Transform(
  t.String({ pattern: '^[0-9a-fA-F]{24}$' })
)
  .Decode((value) => new ObjectId(value))
  .Encode((value: ObjectId) => value.toString())
