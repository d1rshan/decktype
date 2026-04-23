import { ObjectId } from "mongodb";
import { t } from "elysia";

import { ApiError } from "./errors";

const MONGO_ID_PATTERN = "^[0-9a-fA-F]{24}$";

export const MongoIdString = t.String({
  pattern: MONGO_ID_PATTERN,
});

export const parseObjectId = (value: string, fieldName = "id") => {
  if (!ObjectId.isValid(value)) {
    throw ApiError.badRequest(`Invalid ${fieldName}.`);
  }

  return new ObjectId(value);
};
