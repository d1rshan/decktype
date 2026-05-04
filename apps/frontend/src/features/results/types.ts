import type { Treaty } from "@elysiajs/eden";

import type { api } from "@/lib/api-client";

export type Result = Treaty.Data<typeof api.users.results.get>[number];

export type CreateResultInput = Parameters<typeof api.users.results.post>[0];
