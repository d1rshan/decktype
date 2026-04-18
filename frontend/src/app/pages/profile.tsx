import { Show, createMemo, createSignal } from 'solid-js'
import { User } from 'lucide-solid'

import AuthForms from '@/features/auth/components/auth-forms'
import ResultsTable from '@/features/results/components/results-table'
import { getErrorMessage } from '@/lib/api-client'
import { authClient } from '@/lib/auth-client'
import { formatDateTime } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

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
      setErrorMessage(getErrorMessage(error))
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
            <LoadingSpinner />
          </div>
        )}
      >
        <Show
          when={isAuthenticated()}
          fallback={(
            <AuthForms onSuccess={() => props.onNavigate('/')} />
          )}
        >
          <div class="flex w-full flex-col gap-8">
            <section class="space-y-5">
              <div class="flex flex-wrap items-center justify-between gap-3">
                <h2 class="text-2xl leading-tight font-bold capitalize">profile</h2>
                <div class="flex flex-wrap gap-3">
                  <Button
                    class="h-8 px-3 text-xs"
                    onClick={() => props.onNavigate('/')}
                  >
                    back home
                  </Button>
                  <Button
                    class="h-8 px-3 text-xs"
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
                    <h2 class="text-2xl leading-tight font-bold">{currentUser()?.name}</h2>
                    <Show when={joinedAt()}>
                      {(value) => (
                        <p class="text-base leading-normal text-(--sub)">
                          joined {formatDateTime(value())}
                        </p>
                      )}
                    </Show>
                  </div>
                </div>
              </div>
            </section>

            <section class="space-y-4">
              <h2 class="text-2xl leading-tight font-bold capitalize">recent results</h2>
              <ResultsTable />
            </section>

            <Show when={statusMessage()}>
              {(message) => (
                <div>
                  <p class="text-base leading-normal text-(--main)">{message()}</p>
                </div>
              )}
            </Show>

            <Show when={errorMessage()}>
              {(message) => (
                <div>
                  <p class="text-base leading-normal text-(--error)">{message()}</p>
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
