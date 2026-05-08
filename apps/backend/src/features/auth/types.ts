import type { auth } from "../auth";

type InferredSession = typeof auth.$Infer.Session;

type AppUser = Omit<InferredSession["user"], "displayUsername" | "username"> & {
  // omit username cause we don need that
  displayUsername: string;
};

export type AppSession = {
  user: AppUser;
  session: InferredSession["session"];
};
