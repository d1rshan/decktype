import { normalizeUrlOrigin, parseCsv } from "./normalize";

const readRequiredEnv = (name: string) => {
  const value = Bun.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
};

const readOptionalEnv = (name: string) => {
  return Bun.env[name];
};

const readAppEnv = () => {
  const value = (Bun.env.NODE_ENV ?? "development").trim().toLowerCase();

  if (value === "production" || value === "prod") {
    return "production";
  }

  return "development";
};

const readPort = () => {
  const rawPort = Bun.env.PORT ?? "3000";
  const port = Number(rawPort);

  if (Number.isNaN(port)) {
    throw new Error(`Invalid PORT value: ${rawPort}`);
  }

  return port;
};

const readCsvEnv = (name: string) => {
  const value = Bun.env[name];

  if (!value) {
    return [];
  }

  return parseCsv(value).map((item) => item.toLowerCase());
};

export const env = {
  get isProduction() {
    return readAppEnv() === "production";
  },
  get port() {
    return readPort();
  },
  get mongoUri() {
    return readRequiredEnv("MONGODB_URI");
  },
  get mongoDbName() {
    return readRequiredEnv("MONGODB_DB_NAME");
  },
  get betterAuthSecret() {
    return readRequiredEnv("BETTER_AUTH_SECRET");
  },
  get betterAuthUrl() {
    const defaultUrl = this.isProduction
      ? this.frontendOrigin
      : "http://localhost:3000";
    // FRONTEND ORIGIN
    return normalizeUrlOrigin(defaultUrl);
  },
  get frontendOrigin() {
    return normalizeUrlOrigin(
      Bun.env.FRONTEND_ORIGIN ?? "http://localhost:5173",
    );
  },
  get githubClientId() {
    return readRequiredEnv("GITHUB_CLIENT_ID");
  },
  get githubClientSecret() {
    return readRequiredEnv("GITHUB_CLIENT_SECRET");
  },
  get googleClientId() {
    return readRequiredEnv("GOOGLE_CLIENT_ID");
  },
  get googleClientSecret() {
    return readRequiredEnv("GOOGLE_CLIENT_SECRET");
  },
  get githubOwner() {
    return Bun.env.GITHUB_OWNER ?? "d1rshan";
  },
  get githubRepo() {
    return Bun.env.GITHUB_REPO ?? "decktype";
  },
  get githubToken() {
    return readOptionalEnv("GITHUB_TOKEN");
  },
  get adminEmails() {
    return readCsvEnv("ADMIN_EMAILS");
  },
};

// TODO: do init check for .env and throw error for vercel
