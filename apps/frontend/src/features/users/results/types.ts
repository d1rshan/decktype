import type { api } from "@/lib/api-client";

export type Result = {
  id: string;
  userId: string;
  gameId: string;
  score: number;
  difficulty: string;
  createdAt: string | Date;
};

export type CreateResultInput = Parameters<typeof api.users.results.post>[0];
