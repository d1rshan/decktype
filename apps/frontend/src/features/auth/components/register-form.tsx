import { Show, createSignal } from "solid-js";

import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { getErrorMessage } from "@/lib/api-client";
import { authClient } from "@/lib/auth-client";
import { createFormState } from "@/lib/form";

import { registerSchema } from "./schemas";

type RegisterFormProps = {
  onSuccess?: () => void;
  disabled?: boolean;
};

export function RegisterForm(props: RegisterFormProps) {
  const [statusMessage, setStatusMessage] = createSignal<string | null>(null);

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

  const clearMessages = () => {
    setStatusMessage(null);
    setError(null);
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    const data = validate(registerSchema);
    if (!data) return;

    setSubmitting(true);
    setStatusMessage(null);

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

      setStatusMessage("Account created.");
      props.onSuccess?.();
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
        onInput={(e) => {
          clearMessages();
          setField("username")(e);
        }}
        placeholder="username"
        required
      />

      <Input
        type="email"
        value={fields.email}
        onInput={(e) => {
          clearMessages();
          setField("email")(e);
        }}
        placeholder="email"
        required
      />

      <Input
        type="email"
        value={fields.confirmEmail}
        onInput={(e) => {
          clearMessages();
          setField("confirmEmail")(e);
        }}
        placeholder="verify email"
        required
      />

      <Input
        type="password"
        value={fields.password}
        onInput={(e) => {
          clearMessages();
          setField("password")(e);
        }}
        placeholder="password"
        required
      />

      <Input
        type="password"
        value={fields.confirmPassword}
        onInput={(e) => {
          clearMessages();
          setField("confirmPassword")(e);
        }}
        placeholder="verify password"
        required
      />

      <Show when={statusMessage()}>
        {(message) => (
          <div class="pt-1 text-(--main)">
            <p class="text-base leading-normal">{message()}</p>
          </div>
        )}
      </Show>

      <Show when={error()}>
        {(message) => (
          <div class="pt-1 text-(--error)">
            <p class="text-base leading-normal">{message()}</p>
          </div>
        )}
      </Show>

      <Button
        type="submit"
        class="mt-1 h-12 w-full"
        disabled={props.disabled || submitting()}
      >
        {submitting() ? "creating account..." : "sign up"}
      </Button>
    </form>
  );
}
