import { Show, createMemo, createSignal } from 'solid-js'

import AuthForms from '@/features/auth/components/auth-forms'
import { useMyResultsQuery } from '@/features/results/api/hooks'
import ResultHistory from '@/features/results/components/result-history'
import { getErrorMessage } from '@/lib/api-client'
import { authClient } from '@/lib/auth-client'

type ProfilePageProps = {
  onNavigate: (target: string) => void
}

function ProfilePage(props: ProfilePageProps) {
  const session = authClient.useSession()
  const [isSigningOut, setIsSigningOut] = createSignal(false)
  const [statusMessage, setStatusMessage] = createSignal<string | null>(null)
  const [errorMessage, setErrorMessage] = createSignal<string | null>(null)

  const isAuthenticated = createMemo(() => Boolean(session().data?.user))
  const isSessionLoading = createMemo(() => session().isPending)
  const profileResultsQuery = useMyResultsQuery({
    enabled: isAuthenticated,
    limit: () => 100,
  })
  const isPageLoading = createMemo(
    () => isSessionLoading() || (isAuthenticated() && profileResultsQuery.isPending),
  )

  const profileStats = createMemo(() => {
    const results = profileResultsQuery.data ?? []
    const testsStarted = results.length
    const testsCompleted = results.length
    const highestScore = results.reduce(
      (highest, result) => Math.max(highest, result.score),
      0,
    )
    const averageScore =
      results.length > 0
        ? Math.round(
            results.reduce((sum, result) => sum + result.score, 0) / results.length,
          )
        : 0

    const lastTenResults = results.slice(0, 10)
    const averageLastTen =
      lastTenResults.length > 0
        ? Math.round(
            lastTenResults.reduce((sum, result) => sum + result.score, 0) /
              lastTenResults.length,
          )
        : 0

    const easyCount = results.filter((result) => result.difficulty === 'easy').length
    const mediumCount = results.filter((result) => result.difficulty === 'medium').length
    const hardCount = results.filter((result) => result.difficulty === 'hard').length

    return {
      testsStarted,
      testsCompleted,
      highestScore,
      averageScore,
      averageLastTen,
      easyCount,
      mediumCount,
      hardCount,
    }
  })

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
        when={!isPageLoading()}
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
          <div class="w-full space-y-6">
          <section class="rounded-xl bg-(--sub-alt)/32 p-5 ring-1 ring-(--sub)/14">
            <div class="flex flex-wrap items-start justify-between gap-5 border-b border-(--sub)/20 pb-5">
              <div>
                <div class="t-label font-semibold uppercase tracking-[0.16em] text-(--sub)">
                  profile
                </div>
                <div class="t-metric-lg mt-2 text-(--text)">
                  {session().data?.user.name}
                </div>
                <div class="t-body mt-2 text-(--sub)">{session().data?.user.email}</div>
              </div>

              <div class="t-body flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  class="rounded-md border border-(--sub)/35 px-3 py-1.5 text-(--sub) transition hover:text-(--text)"
                  onClick={() => props.onNavigate('/')}
                >
                  back home
                </button>
                <button
                  type="button"
                  class="rounded-md border border-(--sub)/35 px-3 py-1.5 text-(--sub) transition hover:text-(--text) disabled:cursor-not-allowed disabled:opacity-60"
                  onClick={handleSignOut}
                  disabled={isSigningOut()}
                >
                  {isSigningOut() ? 'signing out...' : 'sign out'}
                </button>
              </div>
            </div>

            <div class="mt-5 grid gap-4 sm:grid-cols-3">
              <div class="rounded-lg bg-(--sub-alt)/55 px-4 py-4">
                <div class="t-label uppercase tracking-[0.14em] text-(--sub)">tests started</div>
                <div class="t-metric-lg mt-2 text-(--text)">
                  {profileResultsQuery.isPending ? '--' : profileStats().testsStarted}
                </div>
              </div>

              <div class="rounded-lg bg-(--sub-alt)/55 px-4 py-4">
                <div class="t-label uppercase tracking-[0.14em] text-(--sub)">tests completed</div>
                <div class="t-metric-lg mt-2 text-(--text)">
                  {profileResultsQuery.isPending ? '--' : profileStats().testsCompleted}
                </div>
              </div>

              <div class="rounded-lg bg-(--sub-alt)/55 px-4 py-4">
                <div class="t-label uppercase tracking-[0.14em] text-(--sub)">highest score</div>
                <div class="t-metric-lg mt-2 text-(--text)">
                  {profileResultsQuery.isPending ? '--' : profileStats().highestScore}
                </div>
              </div>
            </div>
          </section>

          <section class="grid gap-4 lg:grid-cols-2">
            <div class="rounded-xl bg-(--sub-alt)/32 p-5 ring-1 ring-(--sub)/14">
              <div class="t-label font-semibold uppercase tracking-[0.16em] text-(--sub)">
                score stats
              </div>

              <div class="mt-4 grid gap-y-4 sm:grid-cols-2">
                <div>
                  <div class="t-caption text-(--sub)">average score</div>
                  <div class="t-metric-lg mt-1 text-(--text)">
                    {profileResultsQuery.isPending ? '--' : profileStats().averageScore}
                  </div>
                </div>

                <div>
                  <div class="t-caption text-(--sub)">average score (last 10)</div>
                  <div class="t-metric-lg mt-1 text-(--text)">
                    {profileResultsQuery.isPending ? '--' : profileStats().averageLastTen}
                  </div>
                </div>
              </div>
            </div>

            <div class="rounded-xl bg-(--sub-alt)/32 p-5 ring-1 ring-(--sub)/14">
              <div class="t-label font-semibold uppercase tracking-[0.16em] text-(--sub)">
                difficulty split
              </div>

              <div class="mt-4 grid grid-cols-3 gap-4">
                <div>
                  <div class="t-caption uppercase tracking-[0.1em] text-(--sub)">easy</div>
                  <div class="t-metric-md mt-1 text-(--text)">
                    {profileResultsQuery.isPending ? '--' : profileStats().easyCount}
                  </div>
                </div>

                <div>
                  <div class="t-caption uppercase tracking-[0.1em] text-(--sub)">medium</div>
                  <div class="t-metric-md mt-1 text-(--text)">
                    {profileResultsQuery.isPending ? '--' : profileStats().mediumCount}
                  </div>
                </div>

                <div>
                  <div class="t-caption uppercase tracking-[0.1em] text-(--sub)">hard</div>
                  <div class="t-metric-md mt-1 text-(--text)">
                    {profileResultsQuery.isPending ? '--' : profileStats().hardCount}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section class="rounded-xl bg-(--sub-alt)/22 p-5 ring-1 ring-(--sub)/10">
            <ResultHistory />
          </section>

          <Show when={statusMessage()}>
            {(message) => (
              <div class="t-body text-(--main)">{message()}</div>
            )}
          </Show>

          <Show when={errorMessage()}>
            {(message) => (
              <div class="t-body text-(--error)">{message()}</div>
            )}
          </Show>
          </div>
        </Show>
      </Show>
    </div>
  )
}

export default ProfilePage
