import { createAuthClient } from "better-auth/solid";

import { urls } from "@/lib/urls";

export const authClient = createAuthClient({
  baseURL: urls.backend,
  fetchOptions: {
    credentials: "include",
  },
});
