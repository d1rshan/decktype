import { normalizeUrlOrigin } from "./normalize";

const isProduction =
  (Bun.env.NODE_ENV ?? "development").trim().toLowerCase() === "production" ||
  (Bun.env.NODE_ENV ?? "development").trim().toLowerCase() === "prod";

const readRequiredEnv = (name: string) => {
  const value = Bun.env[name];

  if (!value) {
    throw new Error(`MISSING REQUIRED ENVIRONMENT VARIABLE: ${name}`);
  }

  return value;
};

const getEnv = () => {
  if (isProduction) {
    return {
      isProduction: true,
      port: Number(Bun.env.PORT ?? "3000"),
      mongoUri: readRequiredEnv("MONGODB_URI"),
      mongoDbName: readRequiredEnv("MONGODB_DB_NAME"),
      betterAuthSecret: readRequiredEnv("BETTER_AUTH_SECRET"),
      betterAuthUrl: normalizeUrlOrigin(readRequiredEnv("BETTER_AUTH_URL")),
      frontendOrigin: normalizeUrlOrigin(readRequiredEnv("FRONTEND_ORIGIN")),
      githubClientId: readRequiredEnv("GITHUB_CLIENT_ID"),
      githubClientSecret: readRequiredEnv("GITHUB_CLIENT_SECRET"),
      googleClientId: readRequiredEnv("GOOGLE_CLIENT_ID"),
      googleClientSecret: readRequiredEnv("GOOGLE_CLIENT_SECRET"),
    } as const;
  }

  return {
    isProduction: false,
    port: 3000,
    mongoUri: readRequiredEnv("MONGODB_URI"),
    mongoDbName: readRequiredEnv("MONGODB_DB_NAME"),
    betterAuthSecret:
      Bun.env.BETTER_AUTH_SECRET ??
      "reallylongsupersecuresecretreallylongsupersecuresecret",
    betterAuthUrl: "http://localhost:3000",
    frontendOrigin: "http://localhost:5173",
    githubClientId: Bun.env.GITHUB_CLIENT_ID ?? "",
    githubClientSecret: Bun.env.GITHUB_CLIENT_SECRET ?? "",
    googleClientId: Bun.env.GOOGLE_CLIENT_ID ?? "",
    googleClientSecret: Bun.env.GOOGLE_CLIENT_SECRET ?? "",
  } as const;
};

export const env = getEnv();
