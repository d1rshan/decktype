import { For, Show, createMemo } from 'solid-js'

import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'
import { ApiError, getErrorMessage } from '@/lib/api-client'
import { formatDateTime } from '@/lib/utils'
import { useFeedbackQuery } from '@/features/feedback/api'
import {
  useAdminDeleteFeedbackMutation,
  useAdminUsersCountQuery,
  useAdminUsersListQuery,
} from '@/features/admin/api'

function AdminPage() {
  const session = authClient.useSession()

  const usersCountQuery = useAdminUsersCountQuery()
  const usersListQuery = useAdminUsersListQuery()
  const feedbackQuery = useFeedbackQuery()
  const deleteFeedbackMutation = useAdminDeleteFeedbackMutation()

  const isForbiddenError = (error: unknown) =>
    error instanceof ApiError
    && (error.status === 403 || error.code === 'FORBIDDEN')

  const isUnauthorized = createMemo(() =>
    isForbiddenError(usersCountQuery.error) || isForbiddenError(usersListQuery.error),
  )

  const renderCard = (children: string) => (
    <div class="rounded-lg bg-(--sub-alt) px-4 py-4 text-(--sub)">{children}</div>
  )

  return (
    <div class="w-full min-h-[72vh]">
      <Show
        when={session().data?.user}
        fallback={
          <div class="rounded-lg bg-(--sub-alt) px-5 py-5">
            <p class="text-base leading-normal text-(--sub)">
              sign in with your admin account to access this page.
            </p>
          </div>
        }
      >
        <Show
          when={!isUnauthorized()}
          fallback={
            <div class="rounded-lg bg-(--sub-alt) px-5 py-5">
              <p class="text-base leading-normal text-(--sub)">
                you are signed in but not authorized for admin access.
              </p>
            </div>
          }
        >
          <div class="flex flex-col gap-8">
            <section class="space-y-4">
              <div class="flex items-baseline justify-between gap-3">
                <h2 class="text-2xl leading-tight font-bold capitalize">users</h2>
                <div class="flex items-center gap-3">
                  <Show
                    when={!usersCountQuery.isPending}
                    fallback={<p class="text-sm leading-normal text-(--sub)">loading count...</p>}
                  >
                    <p class="text-sm leading-normal text-(--sub)">
                      total: <span class="text-(--text)">{usersCountQuery.data?.count ?? 0}</span>
                    </p>
                  </Show>
                </div>
              </div>

              <Show when={usersCountQuery.error || usersListQuery.error}>
                <p class="text-base leading-normal text-(--error)">
                  {getErrorMessage(usersCountQuery.error ?? usersListQuery.error)}
                </p>
              </Show>

              <div class="rounded-lg">
                <Show
                  when={!usersListQuery.isPending}
                  fallback={renderCard('loading users...')}
                >
                  <div class="flex max-h-[320px] flex-col gap-2 overflow-y-auto">
                    <For each={usersListQuery.data ?? []}>
                      {(user) => (
                        <div class="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-(--sub-alt) px-4 py-3">
                          <div class="min-w-0">
                            <p class="truncate text-sm text-(--text)">{user.name}</p>
                            <p class="truncate text-xs text-(--sub)">{user.email}</p>
                          </div>
                          <p class="text-xs text-(--sub)">
                            {user.createdAt ? formatDateTime(new Date(user.createdAt)) : 'unknown'}
                          </p>
                        </div>
                      )}
                    </For>
                    <Show when={(usersListQuery.data?.length ?? 0) === 0}>
                      {renderCard('no users found')}
                    </Show>
                  </div>
                </Show>
              </div>
            </section>

            <section class="space-y-4">
              <h2 class="text-2xl leading-tight font-bold capitalize">community messages</h2>

              <div class="rounded-lg">
                <Show
                  when={!feedbackQuery.isPending}
                  fallback={renderCard('loading messages...')}
                >
                  <div class="flex max-h-[420px] flex-col gap-2 overflow-y-auto">
                    <For each={feedbackQuery.data ?? []}>
                      {(item) => (
                        <div class="space-y-2 rounded-lg bg-(--sub-alt) px-4 py-3">
                          <div class="flex items-center justify-between gap-2">
                            <div>
                              <p class="text-sm text-(--text)">{item.userDisplayName}</p>
                              <p class="text-xs text-(--sub)">{formatDateTime(new Date(item.createdAt))}</p>
                            </div>
                            <Button
                              class="h-7 px-3 text-xs"
                              onClick={() => deleteFeedbackMutation.mutate(item.id.toString())}
                              disabled={deleteFeedbackMutation.isPending}
                            >
                              delete
                            </Button>
                          </div>
                          <p class="whitespace-pre-wrap text-sm text-(--text)">{item.content}</p>
                        </div>
                      )}
                    </For>
                    <Show when={(feedbackQuery.data?.length ?? 0) === 0}>
                      {renderCard('no messages found')}
                    </Show>
                  </div>
                </Show>
              </div>
            </section>
          </div>
        </Show>
      </Show>
    </div>
  )
}

export default AdminPage
