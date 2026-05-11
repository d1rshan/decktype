import { LoginForm } from "./login-form";
import { RegisterForm } from "./register-form";

export function AuthForms() {
  return (
    <div class="flex w-full min-h-[60vh] items-center">
      <div class="grid w-full items-start gap-16 lg:grid-cols-2">
        <RegisterForm />
        <LoginForm />
      </div>
    </div>
  );
}

export default AuthForms;
