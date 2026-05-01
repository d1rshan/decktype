import { Elysia } from "elysia"; // for vercel

import { app } from "./app";
import { env } from "./config/env";
import { connectToDatabase } from "./db/client";
import { ensureDatabaseIndexes } from "./db/indexes";

let startupPromise: Promise<void> | undefined;

const ensureStartup = (options?: { ensureIndexes?: boolean }) => {
  if (startupPromise) {
    return startupPromise;
  }

  startupPromise = (async () => {
    await connectToDatabase();

    if (options?.ensureIndexes) {
      await ensureDatabaseIndexes();
    }
  })();

  return startupPromise;
};

await ensureStartup({ ensureIndexes: !env.isProduction }).catch((error) => {
  console.error("Initial MongoDB warmup failed:", error);
});

if (!env.isProduction) {
  app.listen(env.port);
  console.log(`Server running on ${env.betterAuthUrl}`);
}

export default app;
