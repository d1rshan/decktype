import { Show, createMemo, createSignal } from 'solid-js'

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
    <div class="mx-auto flex w-full max-w-6xl flex-1 items-center justify-center">
      <Show
        when={isAuthenticated()}
        fallback={(
          <div class="grid w-full gap-16 lg:grid-cols-2">
            <form class="mx-auto flex w-full max-w-sm flex-col gap-3" onSubmit={handleRegister}>
              <div class="mb-1 text-sm font-semibold text-[var(--sub)]">register</div>

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

              <Show when={statusMessage()}>
                {(message) => (
                  <div class="pt-1 text-sm text-[var(--main)]">{message()}</div>
                )}
              </Show>
              <Show when={errorMessage()}>
                {(message) => (
                  <div class="pt-1 text-sm text-[var(--error)]">{message()}</div>
                )}
              </Show>

              <button
                type="submit"
                class="mt-1 rounded-lg bg-[color:color-mix(in_srgb,var(--sub-alt)_90%,var(--bg))] px-4 py-3 text-lg font-semibold text-[var(--sub)] transition hover:text-[var(--text)] disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isRegistering() || isSigningIn()}
              >
                {isRegistering() ? 'creating account...' : 'sign up'}
              </button>
            </form>

            <form class="mx-auto flex w-full max-w-sm flex-col gap-3" onSubmit={handleLogin}>
              <div class="mb-1 text-sm font-semibold text-[var(--sub)]">login</div>

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

              <Show when={!statusMessage() && errorMessage()}>
                {(message) => (
                  <div class="pt-1 text-sm text-[var(--error)]">{message()}</div>
                )}
              </Show>

              <button
                type="submit"
                class="rounded-lg bg-[color:color-mix(in_srgb,var(--sub-alt)_90%,var(--bg))] px-4 py-3 text-lg font-semibold text-[var(--sub)] transition hover:text-[var(--text)] disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isSigningIn() || isRegistering()}
              >
                {isSigningIn() ? 'signing in...' : 'sign in'}
              </button>

              <button
                type="button"
                class="self-end text-sm text-[var(--sub)] transition hover:text-[var(--text)]"
              >
                forgot password?
              </button>
            </form>
          </div>
        )}
      >
        <div class="mx-auto flex w-full max-w-xl flex-col gap-8">
          <div class="text-sm text-[var(--sub)]">account</div>

          <div class="space-y-4">
            <div class="text-3xl font-semibold text-[var(--text)]">
              {session().data?.user.name}
            </div>
            <div class="text-base text-[var(--sub)]">{session().data?.user.email}</div>
          </div>

          <div class="grid gap-3 text-sm sm:grid-cols-2">
            <div class="rounded-lg bg-[var(--sub-alt)] px-4 py-4 text-[var(--sub)]">
              <div>status</div>
              <div class="mt-2 text-base text-[var(--text)]">signed in</div>
            </div>
            <div class="rounded-lg bg-[var(--sub-alt)] px-4 py-4 text-[var(--sub)]">
              <div>user id</div>
              <div class="mt-2 truncate text-base text-[var(--text)]">
                {session().data?.user.id}
              </div>
            </div>
          </div>

          <ResultHistory />

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

          <div class="flex flex-wrap items-center gap-5 text-base">
            <button
              type="button"
              class="text-[var(--text)] transition hover:text-[var(--main)]"
              onClick={() => props.onNavigate('/')}
            >
              back home
            </button>
            <button
              type="button"
              class="text-[var(--sub)] transition hover:text-[var(--text)] disabled:cursor-not-allowed disabled:opacity-60"
              onClick={handleSignOut}
              disabled={isSigningOut()}
            >
              {isSigningOut() ? 'signing out...' : 'sign out'}
            </button>
          </div>
        </div>
      </Show>
    </div>
  )
}

export default ProfilePage
