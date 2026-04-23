import { ApiError } from "../../lib/errors";
import { feedbackDAL } from "./dal";
import { serializeFeedback } from "./serializers";
import type { CreateFeedbackInput, VoteFeedbackInput } from "./types";

export const submitFeedback = async ({
  content,
  userId,
  userDisplayName,
}: CreateFeedbackInput) => {
  const doc = await feedbackDAL.create({
    content,
    userId,
    userDisplayName,
    upvotedBy: [],
    downvotedBy: [],
    createdAt: new Date(),
  });
  return serializeFeedback(doc);
};

export const listFeedback = async () => {
  const docs = await feedbackDAL.findMany(50);
  return docs.map(serializeFeedback);
};

export const upvoteFeedback = async ({
  feedbackId,
  userId,
}: VoteFeedbackInput) => {
  const result = await feedbackDAL.updateVotes(feedbackId, userId, "up");

  if (!result) {
    throw ApiError.notFound("Feedback not found.");
  }

  return serializeFeedback(result);
};

export const downvoteFeedback = async ({
  feedbackId,
  userId,
}: VoteFeedbackInput) => {
  const result = await feedbackDAL.updateVotes(feedbackId, userId, "down");

  if (!result) {
    throw ApiError.notFound("Feedback not found.");
  }

  return serializeFeedback(result);
};

export const removeFeedback = async (id: VoteFeedbackInput["feedbackId"]) => {
  const deleted = await feedbackDAL.delete(id);

  if (!deleted) {
    throw ApiError.notFound("Feedback not found.");
  }

  return { ok: true };
};
