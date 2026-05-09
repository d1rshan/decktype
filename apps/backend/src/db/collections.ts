import type { Collection } from "mongodb";
import { ObjectId } from "mongodb";

import { db } from "./client";

export type ResultDocument = {
  userId: ObjectId;
  gameId: string;
  score: number;
  difficulty: string;
  createdAt: Date;
};

export type LeaderboardDocument = {
  userId: ObjectId;
  username: string;
  gameId: string;
  difficulty: string;
  bestScore: number;
  createdAt: Date;
};

export type FeedbackDocument = {
  content: string;
  userId: ObjectId;
  username: string;
  upvotedBy: ObjectId[];
  downvotedBy: ObjectId[];
  createdAt: Date;
};

// Better Auth owns the `user` collection shape. We keep this here so feature
// repositories can import one centralized collection registry.
export type UserDocument = {
  // name: string;
  email: string;
  emailVerified: boolean;
  username: string; // Better Auth lookup field, always lowercase
  displayUsername: string;
  usernameLastChangedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
};

export const resultsCollection: Collection<ResultDocument> =
  db.collection<ResultDocument>("results");

export const leaderboardCollection: Collection<LeaderboardDocument> =
  db.collection<LeaderboardDocument>("leaderboard");

export const feedbackCollection: Collection<FeedbackDocument> =
  db.collection<FeedbackDocument>("feedback");

export const usersCollection: Collection<UserDocument> =
  db.collection<UserDocument>("user");
