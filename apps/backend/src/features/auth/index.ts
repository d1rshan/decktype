import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { betterAuth } from "better-auth";
import { username } from "better-auth/plugins";

import { env } from "../../config/env";
import { db, mongoClient } from "../../db/client";

const createUsernameBase = (name?: string | null) => {
  const sanitized = (name ?? "user")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 25);

  return sanitized || "user";
};

export const auth = betterAuth({
  secret: env.betterAuthSecret,
  baseURL: env.betterAuthUrl,
  user: {
    additionalFields: {
      usernameLastChangedAt: {
        type: "date",
        required: false,
      },
    },
  },
  plugins: [
    username({
      minUsernameLength: 3,
      maxUsernameLength: 30,
    }),
  ],
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
        before: async (user) => {
          // If username/displayUsername already present (e.g. email registration), skip
          if (user.username && user.displayUsername) {
            return { data: user };
          }

          // Generate a stable ASCII username base from the provider name.
          const baseUsername = createUsernameBase(user.name);

          let finalUsername = baseUsername;
          let counter = 0;

          // Ensure uniqueness
          while (true) {
            const existingUser = await db.collection("user").findOne({
              username: finalUsername,
            });

            if (!existingUser) break;

            counter++;
            const suffix = `_${Math.floor(100 + Math.random() * 900)}`;
            finalUsername = `${baseUsername.slice(0, 30 - suffix.length)}${suffix}`;

            // Safety break
            if (counter > 10) {
              finalUsername = `${baseUsername.slice(0, 20)}_${Date.now().toString().slice(-8)}`;
              break;
            }
          }

          return {
            data: {
              ...user,
              username: finalUsername,
              displayUsername: finalUsername,
            },
          };
        },
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
