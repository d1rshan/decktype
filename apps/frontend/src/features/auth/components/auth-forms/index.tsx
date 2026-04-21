import { LoginForm } from './login-form'
import { RegisterForm } from './register-form'

type AuthFormsProps = {
  onSuccess?: () => void
}

export function AuthForms(props: AuthFormsProps) {
  return (
    <div class="flex w-full min-h-[60vh] items-center">
      <div class="grid w-full items-start gap-16 lg:grid-cols-2">
        <RegisterForm onSuccess={props.onSuccess} />
        <LoginForm onSuccess={props.onSuccess} />
      </div>
    </div>
  )
}

export default AuthForms
