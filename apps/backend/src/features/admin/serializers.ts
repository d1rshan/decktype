import type { WithId } from "mongodb";
import type { UserDocument } from "../../db/collections";

export const serializeUser = (doc: WithId<UserDocument>) => {
  return {
    id: doc._id.toString(),
    username: doc.displayUsername,
    email: doc.email,
    createdAt: doc.createdAt,
  };
};
