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
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          if (!env.discordWebhookUrl) return;

          try {
            const res = await fetch(env.discordWebhookUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                embeds: [
                  {
                    title: "New User Registered!",
                    description: `**${user.name}**`,
                    color: 0x57f287,
                    timestamp: new Date().toISOString(),
                  },
                ],
              }),
            });

            if (!res.ok) {
              console.error(
                "Discord webhook failed:",
                res.status,
                await res.text(),
              );
            }
          } catch (error) {
            console.error("Failed to send Discord webhook:", error);
          }
        },
      },
    },
  },
});
