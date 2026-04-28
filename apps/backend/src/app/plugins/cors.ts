import { cors } from "@elysiajs/cors";

import { env } from "../../config/env";
import { normalizeUrlOrigin } from "../../config/normalize";

const frontendOrigin = normalizeUrlOrigin(env.frontendOrigin);

const allowedOrigins = new Set([frontendOrigin]);

if (!env.isProduction) {
  allowedOrigins.add(normalizeUrlOrigin("http://localhost:5173"));
}

export const corsPlugin = cors({
  origin: (request) => {
    const requestOrigin = request.headers.get("origin");
    if (!requestOrigin) {
      return true;
    }

    return allowedOrigins.has(normalizeUrlOrigin(requestOrigin));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});
