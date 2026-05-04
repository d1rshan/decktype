export const resultKeys = {
  all: ["results"] as const,
  mine: (gameId?: string, limit = 20) =>
    ["results", "mine", gameId ?? "all", limit] as const,
};
