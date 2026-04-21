import type { Treaty } from '@elysiajs/eden'
import { api } from '@/lib/api-client'

export type Feedback = Treaty.Data<typeof api.feedback.get>[number]
export type CreateFeedbackInput = Parameters<typeof api.feedback.post>[0]
