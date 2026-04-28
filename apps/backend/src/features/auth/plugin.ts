import { Elysia } from "elysia";

import { auth } from "./index";

export const authPlugin = new Elysia({ name: "auth" }).mount(auth.handler);
