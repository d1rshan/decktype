import { Show, createMemo, createSignal } from 'solid-js'

import { useMyResultsQuery } from '@/features/results/api/hooks'
import ResultHistory from '@/features/results/components/result-history'
import { authClient } from '@/lib/auth-client'

type ProfilePageProps = {
  onNavigate: (target: string) => void
}

function ProfilePage(props: ProfilePageProps) {
  const session = authClient.useSession()
  const [registerName, setRegisterName] = createSignal('')
  const [registerEmail, setRegisterEmail] = createSignal('')
  const [registerEmailConfirm, setRegisterEmailConfirm] = createSignal('')
  const [registerPassword, setRegisterPassword] = createSignal('')
  const [registerPasswordConfirm, setRegisterPasswordConfirm] = createSignal('')
  const [loginEmail, setLoginEmail] = createSignal('')
  const [loginPassword, setLoginPassword] = createSignal('')
  const [isRegistering, setIsRegistering] = createSignal(false)
  const [isSigningIn, setIsSigningIn] = createSignal(false)
  const [isSigningOut, setIsSigningOut] = createSignal(false)
  const [statusMessage, setStatusMessage] = createSignal<string | null>(null)
  const [errorMessage, setErrorMessage] = createSignal<string | null>(null)

  const isAuthenticated = createMemo(() => Boolean(session().data?.user))
  const profileResultsQuery = useMyResultsQuery({
    enabled: isAuthenticated,
    limit: () => 100,
  })

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

  const getErrorMessage = (error: unknown) => {
    if (error instanceof Error) {
      return error.message
    }

    return 'Something went wrong. Please try again.'
  }

  const handleRegister = async (event: SubmitEvent) => {
    event.preventDefault()
    resetMessages()

    if (registerEmail().trim() !== registerEmailConfirm().trim()) {
      setErrorMessage('Emails do not match.')
      return
    }

    if (registerPassword() !== registerPasswordConfirm()) {
      setErrorMessage('Passwords do not match.')
      return
    }

    setIsRegistering(true)

    try {
      const result = await authClient.signUp.email({
        name: registerName().trim(),
        email: registerEmail().trim(),
        password: registerPassword(),
      })

      if (result.error) {
        setErrorMessage(result.error.message ?? 'Unable to create account.')
        return
      }

      setStatusMessage('Account created.')
      props.onNavigate('/')
    }
    catch (error) {
      setErrorMessage(getErrorMessage(error))
    }
    finally {
      setIsRegistering(false)
    }
  }

  const handleLogin = async (event: SubmitEvent) => {
    event.preventDefault()
    resetMessages()
    setIsSigningIn(true)

    try {
      const result = await authClient.signIn.email({
        email: loginEmail().trim(),
        password: loginPassword(),
      })

      if (result.error) {
        setErrorMessage(result.error.message ?? 'Unable to sign in.')
        return
      }

      setStatusMessage('Signed in.')
      props.onNavigate('/')
    }
    catch (error) {
      setErrorMessage(getErrorMessage(error))
    }
    finally {
      setIsSigningIn(false)
    }
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
        when={isAuthenticated()}
        fallback={(
          <div class="grid w-full items-start gap-6 lg:grid-cols-2">
            <form
              class="rounded-xl bg-[var(--sub-alt)]/38 p-5 ring-1 ring-[var(--sub)]/16"
              onSubmit={handleRegister}
            >
              <div class="mb-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--sub)]">
                register
              </div>

              <div class="flex flex-col gap-3">
                <input
                  class="rounded-lg bg-[var(--sub-alt)] px-4 py-3 text-base text-[var(--text)] outline-none placeholder:text-[var(--sub)] focus:bg-[color:color-mix(in_srgb,var(--sub-alt)_80%,var(--bg))]"
                  value={registerName()}
                  onInput={(event) => setRegisterName(event.currentTarget.value)}
                  placeholder="username"
                  required
                />
                <input
                  type="email"
                  class="rounded-lg bg-[var(--sub-alt)] px-4 py-3 text-base text-[var(--text)] outline-none placeholder:text-[var(--sub)] focus:bg-[color:color-mix(in_srgb,var(--sub-alt)_80%,var(--bg))]"
                  value={registerEmail()}
                  onInput={(event) => setRegisterEmail(event.currentTarget.value)}
                  placeholder="email"
                  required
                />
                <input
                  type="email"
                  class="rounded-lg bg-[var(--sub-alt)] px-4 py-3 text-base text-[var(--text)] outline-none placeholder:text-[var(--sub)] focus:bg-[color:color-mix(in_srgb,var(--sub-alt)_80%,var(--bg))]"
                  value={registerEmailConfirm()}
                  onInput={(event) => setRegisterEmailConfirm(event.currentTarget.value)}
                  placeholder="verify email"
                  required
                />
                <input
                  type="password"
                  class="rounded-lg bg-[var(--sub-alt)] px-4 py-3 text-base text-[var(--text)] outline-none placeholder:text-[var(--sub)] focus:bg-[color:color-mix(in_srgb,var(--sub-alt)_80%,var(--bg))]"
                  value={registerPassword()}
                  onInput={(event) => setRegisterPassword(event.currentTarget.value)}
                  placeholder="password"
                  required
                />
                <input
                  type="password"
                  class="rounded-lg bg-[var(--sub-alt)] px-4 py-3 text-base text-[var(--text)] outline-none placeholder:text-[var(--sub)] focus:bg-[color:color-mix(in_srgb,var(--sub-alt)_80%,var(--bg))]"
                  value={registerPasswordConfirm()}
                  onInput={(event) => setRegisterPasswordConfirm(event.currentTarget.value)}
                  placeholder="verify password"
                  required
                />
              </div>

              <Show when={statusMessage()}>
                {(message) => (
                  <div class="pt-3 text-sm text-[var(--main)]">{message()}</div>
                )}
              </Show>
              <Show when={errorMessage()}>
                {(message) => (
                  <div class="pt-3 text-sm text-[var(--error)]">{message()}</div>
                )}
              </Show>

              <button
                type="submit"
                class="mt-4 rounded-lg bg-[color:color-mix(in_srgb,var(--sub-alt)_90%,var(--bg))] px-4 py-3 text-base font-semibold text-[var(--sub)] transition hover:text-[var(--text)] disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isRegistering() || isSigningIn()}
              >
                {isRegistering() ? 'creating account...' : 'sign up'}
              </button>
            </form>

            <form
              class="rounded-xl bg-[var(--sub-alt)]/38 p-5 ring-1 ring-[var(--sub)]/16"
              onSubmit={handleLogin}
            >
              <div class="mb-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--sub)]">
                login
              </div>

              <div class="flex flex-col gap-3">
                <input
                  type="email"
                  class="rounded-lg bg-[var(--sub-alt)] px-4 py-3 text-base text-[var(--text)] outline-none placeholder:text-[var(--sub)] focus:bg-[color:color-mix(in_srgb,var(--sub-alt)_80%,var(--bg))]"
                  value={loginEmail()}
                  onInput={(event) => setLoginEmail(event.currentTarget.value)}
                  placeholder="email"
                  required
                />
                <input
                  type="password"
                  class="rounded-lg bg-[var(--sub-alt)] px-4 py-3 text-base text-[var(--text)] outline-none placeholder:text-[var(--sub)] focus:bg-[color:color-mix(in_srgb,var(--sub-alt)_80%,var(--bg))]"
                  value={loginPassword()}
                  onInput={(event) => setLoginPassword(event.currentTarget.value)}
                  placeholder="password"
                  required
                />
              </div>

              <Show when={!statusMessage() && errorMessage()}>
                {(message) => (
                  <div class="pt-3 text-sm text-[var(--error)]">{message()}</div>
                )}
              </Show>

              <button
                type="submit"
                class="mt-4 rounded-lg bg-[color:color-mix(in_srgb,var(--sub-alt)_90%,var(--bg))] px-4 py-3 text-base font-semibold text-[var(--sub)] transition hover:text-[var(--text)] disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isSigningIn() || isRegistering()}
              >
                {isSigningIn() ? 'signing in...' : 'sign in'}
              </button>
            </form>
          </div>
        )}
      >
        <div class="w-full space-y-6">
          <section class="rounded-xl bg-[var(--sub-alt)]/32 p-5 ring-1 ring-[var(--sub)]/14">
            <div class="flex flex-wrap items-start justify-between gap-5 border-b border-[var(--sub)]/20 pb-5">
              <div>
                <div class="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--sub)]">
                  profile
                </div>
                <div class="mt-2 text-4xl leading-none text-[var(--text)]">
                  {session().data?.user.name}
                </div>
                <div class="mt-2 text-sm text-[var(--sub)]">{session().data?.user.email}</div>
              </div>

              <div class="flex flex-wrap items-center gap-3 text-sm">
                <button
                  type="button"
                  class="rounded-md border border-[var(--sub)]/35 px-3 py-1.5 text-[var(--sub)] transition hover:text-[var(--text)]"
                  onClick={() => props.onNavigate('/')}
                >
                  back home
                </button>
                <button
                  type="button"
                  class="rounded-md border border-[var(--sub)]/35 px-3 py-1.5 text-[var(--sub)] transition hover:text-[var(--text)] disabled:cursor-not-allowed disabled:opacity-60"
                  onClick={handleSignOut}
                  disabled={isSigningOut()}
                >
                  {isSigningOut() ? 'signing out...' : 'sign out'}
                </button>
              </div>
            </div>

            <div class="mt-5 grid gap-4 sm:grid-cols-3">
              <div class="rounded-lg bg-[var(--sub-alt)]/55 px-4 py-4">
                <div class="text-[10px] uppercase tracking-[0.14em] text-[var(--sub)]">tests started</div>
                <div class="mt-2 text-4xl leading-none text-[var(--text)]">
                  {profileResultsQuery.isPending ? '--' : profileStats().testsStarted}
                </div>
              </div>

              <div class="rounded-lg bg-[var(--sub-alt)]/55 px-4 py-4">
                <div class="text-[10px] uppercase tracking-[0.14em] text-[var(--sub)]">tests completed</div>
                <div class="mt-2 text-4xl leading-none text-[var(--text)]">
                  {profileResultsQuery.isPending ? '--' : profileStats().testsCompleted}
                </div>
              </div>

              <div class="rounded-lg bg-[var(--sub-alt)]/55 px-4 py-4">
                <div class="text-[10px] uppercase tracking-[0.14em] text-[var(--sub)]">highest score</div>
                <div class="mt-2 text-4xl leading-none text-[var(--text)]">
                  {profileResultsQuery.isPending ? '--' : profileStats().highestScore}
                </div>
              </div>
            </div>
          </section>

          <section class="grid gap-4 lg:grid-cols-2">
            <div class="rounded-xl bg-[var(--sub-alt)]/32 p-5 ring-1 ring-[var(--sub)]/14">
              <div class="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--sub)]">
                score stats
              </div>

              <div class="mt-4 grid gap-y-4 sm:grid-cols-2">
                <div>
                  <div class="text-xs text-[var(--sub)]">average score</div>
                  <div class="mt-1 text-4xl leading-none text-[var(--text)]">
                    {profileResultsQuery.isPending ? '--' : profileStats().averageScore}
                  </div>
                </div>

                <div>
                  <div class="text-xs text-[var(--sub)]">average score (last 10)</div>
                  <div class="mt-1 text-4xl leading-none text-[var(--text)]">
                    {profileResultsQuery.isPending ? '--' : profileStats().averageLastTen}
                  </div>
                </div>
              </div>
            </div>

            <div class="rounded-xl bg-[var(--sub-alt)]/32 p-5 ring-1 ring-[var(--sub)]/14">
              <div class="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--sub)]">
                difficulty split
              </div>

              <div class="mt-4 grid grid-cols-3 gap-4">
                <div>
                  <div class="text-xs uppercase tracking-[0.1em] text-[var(--sub)]">easy</div>
                  <div class="mt-1 text-3xl leading-none text-[var(--text)]">
                    {profileResultsQuery.isPending ? '--' : profileStats().easyCount}
                  </div>
                </div>

                <div>
                  <div class="text-xs uppercase tracking-[0.1em] text-[var(--sub)]">medium</div>
                  <div class="mt-1 text-3xl leading-none text-[var(--text)]">
                    {profileResultsQuery.isPending ? '--' : profileStats().mediumCount}
                  </div>
                </div>

                <div>
                  <div class="text-xs uppercase tracking-[0.1em] text-[var(--sub)]">hard</div>
                  <div class="mt-1 text-3xl leading-none text-[var(--text)]">
                    {profileResultsQuery.isPending ? '--' : profileStats().hardCount}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section class="rounded-xl bg-[var(--sub-alt)]/22 p-5 ring-1 ring-[var(--sub)]/10">
            <ResultHistory />
          </section>

          <Show when={statusMessage()}>
            {(message) => (
              <div class="text-sm text-[var(--main)]">{message()}</div>
            )}
          </Show>

          <Show when={errorMessage()}>
            {(message) => (
              <div class="text-sm text-[var(--error)]">{message()}</div>
            )}
          </Show>
        </div>
      </Show>
    </div>
  )
}

export default ProfilePage
