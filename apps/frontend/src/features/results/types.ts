import type { Treaty } from "@elysiajs/eden";

import type { api } from "@/lib/api-client";

export type Result = Treaty.Data<typeof api.results.me.get>[number];
