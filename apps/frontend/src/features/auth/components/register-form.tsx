import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import FormError from "@/components/ui/form-error";
import { getErrorMessage } from "@/lib/api-client";
import { authClient } from "@/lib/auth-client";
import { createFormState } from "@/lib/form";

import { registerSchema } from "./schemas";

export function RegisterForm() {
  const {
    fields,
    setField,
    error,
    setError,
    submitting,
    setSubmitting,
    validate,
  } = createFormState({
    username: "",
    email: "",
    confirmEmail: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    const data = validate(registerSchema);
    if (!data) return;

    setSubmitting(true);

    try {
      const result = await authClient.signUp.email({
        name: data.username.trim(),
        username: data.username.trim(),
        email: data.email.trim(),
        password: data.password,
      });

      if (result.error) {
        setError(result.error.message ?? "Unable to create account.");
        return;
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      class="mx-auto flex w-full max-w-sm flex-col gap-3"
    >
      <span class="text-xs leading-none font-semibold tracking-widest uppercase">
        register
      </span>

      <Input
        value={fields.username}
        onInput={setField("username")}
        placeholder="username"
        required
      />

      <Input
        type="email"
        value={fields.email}
        onInput={setField("email")}
        placeholder="email"
        required
      />

      <Input
        type="email"
        value={fields.confirmEmail}
        onInput={setField("confirmEmail")}
        placeholder="verify email"
        required
      />

      <Input
        type="password"
        value={fields.password}
        onInput={setField("password")}
        placeholder="password"
        required
      />

      <Input
        type="password"
        value={fields.confirmPassword}
        onInput={setField("confirmPassword")}
        placeholder="verify password"
        required
      />

      <FormError message={error()} />

      <Button type="submit" class="mt-1 h-12 w-full" disabled={submitting()}>
        {submitting() ? "creating account..." : "sign up"}
      </Button>
    </form>
  );
}
