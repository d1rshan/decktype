import { createAuthClient } from "better-auth/solid";
import { usernameClient } from "better-auth/client/plugins";

import { urls } from "@/lib/urls";

export const authClient = createAuthClient({
  baseURL: urls.backend,
  plugins: [usernameClient()],
  fetchOptions: {
    credentials: "include",
  },
});
