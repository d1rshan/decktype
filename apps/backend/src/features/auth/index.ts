import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { betterAuth } from "better-auth";

import { env } from "../../config/env";
import { db, mongoClient } from "../../db/client";

export const auth = betterAuth({
  secret: env.betterAuthSecret,
  baseURL: env.betterAuthUrl,
  trustedOrigins: [env.frontendOrigin],
  socialProviders: {
    google: {
      clientId: env.googleClientId,
      clientSecret: env.googleClientSecret,
    },
    github: {
      clientId: env.githubClientId,
      clientSecret: env.githubClientSecret,
      scope: ["user:email"],
    },
  },
  advanced: {
    useSecureCookies: env.isProduction,
    defaultCookieAttributes: {
      secure: env.isProduction,
      sameSite: "lax",
      httpOnly: true,
    },
    storeStateStrategy: "cookie",
  },
  account: {
    skipStateCookieCheck: true,
  },
  database: mongodbAdapter(db, {
    client: mongoClient,
    transaction: false,
  }),
  emailAndPassword: {
    enabled: true,
  },
});
