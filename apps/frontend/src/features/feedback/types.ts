import type { Treaty } from "@elysiajs/eden";

import type { api } from "@/lib/api-client";

export type Feedback = Treaty.Data<typeof api.feedback.get>[number];
