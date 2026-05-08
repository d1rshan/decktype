import type { ObjectId } from "mongodb";

export type CreateFeedbackInput = {
  content: string;
  userId: ObjectId;
  username: string;
};

export type VoteFeedbackInput = {
  feedbackId: ObjectId;
  userId: ObjectId;
};
