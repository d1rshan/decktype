import type { Treaty } from '@elysiajs/eden'
import { api } from '@/lib/api-client'
import type { Feedback } from '@/features/feedback/api/contract'

type DeleteFeedbackEndpoint = ReturnType<typeof api.admin.feedback>

export type AdminUsersCount = Treaty.Data<typeof api.admin.users.count.get>
export type AdminUser = Treaty.Data<typeof api.admin.users.get>[number]
export type DeleteFeedbackResponse = Treaty.Data<DeleteFeedbackEndpoint['delete']>
export type AdminFeedback = Feedback
