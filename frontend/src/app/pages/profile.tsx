import { Show, createMemo, createSignal } from 'solid-js'
import { User } from 'lucide-solid'

import AuthForms from '@/features/auth/components/auth-forms'
import ResultsTable from '@/features/results/components/results-table'
import { getErrorMessage } from '@/lib/api-client'
import { authClient } from '@/lib/auth-client'
import { formatDateTime } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'

type ProfileProps = {
  onNavigate: (target: string) => void
}

function ProfilePage(props: ProfileProps) {
  const session = authClient.useSession()
  const [isSigningOut, setIsSigningOut] = createSignal(false)
  const [statusMessage, setStatusMessage] = createSignal<string | null>(null)
  const [errorMessage, setErrorMessage] = createSignal<string | null>(null)

  const isAuthenticated = createMemo(() => Boolean(session().data?.user))
  const isSessionLoading = createMemo(() => session().isPending)
  const currentUser = createMemo(() => session().data?.user)
  const joinedAt = createMemo(() => currentUser()?.createdAt as string | undefined)

  const resetMessages = () => {
    setStatusMessage(null)
    setErrorMessage(null)
  }

  const handleSignOut = async () => {
    resetMessages()
    setIsSigningOut(true)

    try {
      const result = await authClient.signOut()

      if (result.error) {
        setErrorMessage(result.error.message ?? 'Unable to sign out.')
        return
      }

      setStatusMessage('Signed out.')
    }
    catch (error) {
      setErrorMessage(getErrorMessage(error, 'Unable to sign out.'))
    }
    finally {
      setIsSigningOut(false)
    }
  }

  return (
    <div class="flex w-full min-h-[72vh] flex-1">
      <Show
        when={!isSessionLoading()}
        fallback={(
          <div class="flex w-full items-center justify-center py-20">
            <div
              class="h-8 w-8 animate-spin rounded-full border-2 border-(--sub)/35 border-t-(--main)"
              aria-label="Loading profile"
              role="status"
            />
          </div>
        )}
      >
        <Show
          when={isAuthenticated()}
          fallback={(
            <AuthForms onSuccess={() => props.onNavigate('/')} />
          )}
        >
          <div class="mx-auto flex w-full max-w-6xl flex-col gap-8">
            <section class="space-y-5">
              <div class="flex flex-wrap items-center justify-between gap-3">
                <Text variant="title" class="capitalize">profile</Text>
                <div class="flex flex-wrap gap-3">
                  <Button
                    size="sm"
                    onClick={() => props.onNavigate('/')}
                  >
                    back home
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSignOut}
                    disabled={isSigningOut()}
                  >
                    {isSigningOut() ? 'signing out...' : 'sign out'}
                  </Button>
                </div>
              </div>

              <div class="space-y-4 rounded-xl bg-(--sub-alt) p-5">
                <div class="flex items-center gap-4">
                  <div class="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-(--sub) text-(--bg)">
                    <Show
                      when={currentUser()?.image}
                      fallback={<User size={24} strokeWidth={2.2} />}
                    >
                      {(image) => (
                        <img
                          src={image()}
                          alt={`${currentUser()?.name ?? 'User'} avatar`}
                          class="h-full w-full object-cover"
                        />
                      )}
                    </Show>
                  </div>
                  <div class="space-y-1">
                    <Text variant="title">{currentUser()?.name}</Text>
                    <Show when={joinedAt()}>
                      {(value) => (
                        <Text variant="body" tone="sub">
                          joined {formatDateTime(value())}
                        </Text>
                      )}
                    </Show>
                  </div>
                </div>
              </div>
            </section>

            <section class="space-y-4">
              <Text variant="title" class="capitalize">recent results</Text>
              <ResultsTable />
            </section>

            <Show when={statusMessage()}>
              {(message) => (
                <div>
                  <Text variant="body" tone="main">{message()}</Text>
                </div>
              )}
            </Show>

            <Show when={errorMessage()}>
              {(message) => (
                <div>
                  <Text variant="body" tone="error">{message()}</Text>
                </div>
              )}
            </Show>
          </div>
        </Show>
      </Show>
    </div>
  )
}

export default ProfilePage
