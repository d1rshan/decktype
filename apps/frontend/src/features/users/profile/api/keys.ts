export const profileKeys = {
  all: ["profile"] as const,
  username: (username: string) => [...profileKeys.all, username] as const,
};
