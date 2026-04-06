import { createForm } from '@tanstack/solid-form'
import { Show, createMemo, createSignal } from 'solid-js'
import { z } from 'zod'

import Button from '@/app/components/ui/button'
import Input from '@/app/components/ui/input'
import { getErrorMessage } from '@/lib/api-client'
import { authClient } from '@/lib/auth-client'

type AuthFormsProps = {
  onSuccess?: () => void
}

const registerSchema = z
  .object({
    name: z.string().trim().min(1, 'Username is required.'),
    email: z.string().trim().email('Please enter a valid email.'),
    confirmEmail: z.string().trim().email('Please enter a valid confirmation email.'),
    password: z.string().min(1, 'Password is required.'),
    confirmPassword: z.string().min(1, 'Please confirm your password.'),
  })
  .superRefine((value, ctx) => {
    if (value.email !== value.confirmEmail) {
      ctx.addIssue({
        code: 'custom',
        path: ['confirmEmail'],
        message: 'Emails do not match.',
      })
    }

    if (value.password !== value.confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        path: ['confirmPassword'],
        message: 'Passwords do not match.',
      })
    }
  })

const loginSchema = z.object({
  email: z.string().trim().email('Please enter a valid email.'),
  password: z.string().min(1, 'Password is required.'),
})

function getFirstValidationMessage(errors: unknown[]) {
  for (const error of errors) {
    if (typeof error === 'string' && error.trim()) {
      return error
    }

    if (error && typeof error === 'object' && 'message' in error) {
      const message = (error as { message?: unknown }).message

      if (typeof message === 'string' && message.trim()) {
        return message
      }
    }
  }

  return null
}

function AuthForms(props: AuthFormsProps) {
  const [registerStatusMessage, setRegisterStatusMessage] = createSignal<string | null>(null)
  const [registerErrorMessage, setRegisterErrorMessage] = createSignal<string | null>(null)
  const [loginStatusMessage, setLoginStatusMessage] = createSignal<string | null>(null)
  const [loginErrorMessage, setLoginErrorMessage] = createSignal<string | null>(null)

  const registerForm = createForm(() => ({
    defaultValues: {
      name: '',
      email: '',
      confirmEmail: '',
      password: '',
      confirmPassword: '',
    },
    validators: {
      onSubmit: registerSchema,
    },
    onSubmit: async ({ value }) => {
      setRegisterStatusMessage(null)
      setRegisterErrorMessage(null)

      try {
        const result = await authClient.signUp.email({
          name: value.name.trim(),
          email: value.email.trim(),
          password: value.password,
        })

        if (result.error) {
          setRegisterErrorMessage(result.error.message ?? 'Unable to create account.')
          return
        }

        setRegisterStatusMessage('Account created.')
        props.onSuccess?.()
      }
      catch (error) {
        setRegisterErrorMessage(getErrorMessage(error, 'Unable to create account.'))
      }
    },
  }))

  const loginForm = createForm(() => ({
    defaultValues: {
      email: '',
      password: '',
    },
    validators: {
      onSubmit: loginSchema,
    },
    onSubmit: async ({ value }) => {
      setLoginStatusMessage(null)
      setLoginErrorMessage(null)

      try {
        const result = await authClient.signIn.email({
          email: value.email.trim(),
          password: value.password,
        })

        if (result.error) {
          setLoginErrorMessage(result.error.message ?? 'Unable to sign in.')
          return
        }

        setLoginStatusMessage('Signed in.')
        props.onSuccess?.()
      }
      catch (error) {
        setLoginErrorMessage(getErrorMessage(error, 'Unable to sign in.'))
      }
    },
  }))

  const registerFormState = registerForm.useStore((state) => ({
    isSubmitting: state.isSubmitting,
    submissionAttempts: state.submissionAttempts,
  }))
  const loginFormState = loginForm.useStore((state) => ({
    isSubmitting: state.isSubmitting,
    submissionAttempts: state.submissionAttempts,
  }))
  const isAnySubmitting = createMemo(
    () => registerFormState().isSubmitting || loginFormState().isSubmitting,
  )

  const clearRegisterMessages = () => {
    setRegisterStatusMessage(null)
    setRegisterErrorMessage(null)
  }

  const clearLoginMessages = () => {
    setLoginStatusMessage(null)
    setLoginErrorMessage(null)
  }

  return (
    <div class="flex w-full min-h-[60vh] items-center">
      <div class="grid w-full items-start gap-16 lg:grid-cols-2">
        <form
          class="mx-auto flex w-full max-w-sm flex-col gap-3"
          onSubmit={(event) => {
            event.preventDefault()
            void registerForm.handleSubmit()
          }}
        >
          <div class="t-body mb-1 font-semibold text-(--sub)">register</div>

          <registerForm.Field name="name">
            {(field) => {
              const validationMessage = getFirstValidationMessage(field().state.meta.errors)

              return (
                <>
                  <Input
                    value={field().state.value}
                    onInput={(event) => {
                      clearRegisterMessages()
                      field().handleChange(event.currentTarget.value)
                    }}
                    onBlur={field().handleBlur}
                    placeholder="username"
                    required
                  />
                  <Show when={validationMessage && registerFormState().submissionAttempts > 0}>
                    <div class="t-body pt-1 text-(--error)">{validationMessage}</div>
                  </Show>
                </>
              )
            }}
          </registerForm.Field>

          <registerForm.Field name="email">
            {(field) => {
              const validationMessage = getFirstValidationMessage(field().state.meta.errors)

              return (
                <>
                  <Input
                    type="email"
                    value={field().state.value}
                    onInput={(event) => {
                      clearRegisterMessages()
                      field().handleChange(event.currentTarget.value)
                    }}
                    onBlur={field().handleBlur}
                    placeholder="email"
                    required
                  />
                  <Show when={validationMessage && registerFormState().submissionAttempts > 0}>
                    <div class="t-body pt-1 text-(--error)">{validationMessage}</div>
                  </Show>
                </>
              )
            }}
          </registerForm.Field>

          <registerForm.Field name="confirmEmail">
            {(field) => {
              const validationMessage = getFirstValidationMessage(field().state.meta.errors)

              return (
                <>
                  <Input
                    type="email"
                    value={field().state.value}
                    onInput={(event) => {
                      clearRegisterMessages()
                      field().handleChange(event.currentTarget.value)
                    }}
                    onBlur={field().handleBlur}
                    placeholder="verify email"
                    required
                  />
                  <Show when={validationMessage && registerFormState().submissionAttempts > 0}>
                    <div class="t-body pt-1 text-(--error)">{validationMessage}</div>
                  </Show>
                </>
              )
            }}
          </registerForm.Field>

          <registerForm.Field name="password">
            {(field) => {
              const validationMessage = getFirstValidationMessage(field().state.meta.errors)

              return (
                <>
                  <Input
                    type="password"
                    value={field().state.value}
                    onInput={(event) => {
                      clearRegisterMessages()
                      field().handleChange(event.currentTarget.value)
                    }}
                    onBlur={field().handleBlur}
                    placeholder="password"
                    required
                  />
                  <Show when={validationMessage && registerFormState().submissionAttempts > 0}>
                    <div class="t-body pt-1 text-(--error)">{validationMessage}</div>
                  </Show>
                </>
              )
            }}
          </registerForm.Field>

          <registerForm.Field name="confirmPassword">
            {(field) => {
              const validationMessage = getFirstValidationMessage(field().state.meta.errors)

              return (
                <>
                  <Input
                    type="password"
                    value={field().state.value}
                    onInput={(event) => {
                      clearRegisterMessages()
                      field().handleChange(event.currentTarget.value)
                    }}
                    onBlur={field().handleBlur}
                    placeholder="verify password"
                    required
                  />
                  <Show when={validationMessage && registerFormState().submissionAttempts > 0}>
                    <div class="t-body pt-1 text-(--error)">{validationMessage}</div>
                  </Show>
                </>
              )
            }}
          </registerForm.Field>

          <Show when={registerStatusMessage()}>
            {(message) => <div class="t-body pt-1 text-(--main)">{message()}</div>}
          </Show>
          <Show when={registerErrorMessage()}>
            {(message) => <div class="t-body pt-1 text-(--error)">{message()}</div>}
          </Show>

          <Button
            type="submit"
            size="lg"
            class="mt-1"
            disabled={isAnySubmitting()}
          >
            {registerFormState().isSubmitting ? 'creating account...' : 'sign up'}
          </Button>
        </form>

        <form
          class="mx-auto flex w-full max-w-sm flex-col gap-3"
          onSubmit={(event) => {
            event.preventDefault()
            void loginForm.handleSubmit()
          }}
        >
          <div class="t-body mb-1 font-semibold text-(--sub)">login</div>

          <loginForm.Field name="email">
            {(field) => {
              const validationMessage = getFirstValidationMessage(field().state.meta.errors)

              return (
                <>
                  <Input
                    type="email"
                    value={field().state.value}
                    onInput={(event) => {
                      clearLoginMessages()
                      field().handleChange(event.currentTarget.value)
                    }}
                    onBlur={field().handleBlur}
                    placeholder="email"
                    required
                  />
                  <Show when={validationMessage && loginFormState().submissionAttempts > 0}>
                    <div class="t-body pt-1 text-(--error)">{validationMessage}</div>
                  </Show>
                </>
              )
            }}
          </loginForm.Field>

          <loginForm.Field name="password">
            {(field) => {
              const validationMessage = getFirstValidationMessage(field().state.meta.errors)

              return (
                <>
                  <Input
                    type="password"
                    value={field().state.value}
                    onInput={(event) => {
                      clearLoginMessages()
                      field().handleChange(event.currentTarget.value)
                    }}
                    onBlur={field().handleBlur}
                    placeholder="password"
                    required
                  />
                  <Show when={validationMessage && loginFormState().submissionAttempts > 0}>
                    <div class="t-body pt-1 text-(--error)">{validationMessage}</div>
                  </Show>
                </>
              )
            }}
          </loginForm.Field>

          <Show when={loginStatusMessage()}>
            {(message) => <div class="t-body pt-1 text-(--main)">{message()}</div>}
          </Show>
          <Show when={loginErrorMessage()}>
            {(message) => <div class="t-body pt-1 text-(--error)">{message()}</div>}
          </Show>

          <Button
            type="submit"
            size="lg"
            disabled={isAnySubmitting()}
          >
            {loginFormState().isSubmitting ? 'signing in...' : 'sign in'}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default AuthForms
