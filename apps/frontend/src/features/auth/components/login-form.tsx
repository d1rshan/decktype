import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import FormError from "@/components/ui/form-error";
import { getErrorMessage } from "@/lib/api-client";
import { authClient } from "@/lib/auth-client";
import { createFormState } from "@/lib/form";

import { loginSchema } from "./schemas";
import { SocialAuthButtons } from "./social-auth-buttons";

export function LoginForm() {
  const {
    fields,
    setField,
    error,
    setError,
    submitting,
    setSubmitting,
    validate,
  } = createFormState({ usernameOrEmail: "", password: "" });

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    const data = validate(loginSchema);
    if (!data) return;

    setSubmitting(true);

    try {
      const identifier = data.usernameOrEmail.trim();
      const isEmail = identifier.includes("@");

      const result = isEmail
        ? await authClient.signIn.email({
            email: identifier,
            password: data.password,
          })
        : await authClient.signIn.username({
            username: identifier,
            password: data.password,
          });

      if (result.error) {
        setError(result.error.message ?? "Unable to sign in.");
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
        login
      </span>

      <SocialAuthButtons />

      <div class="flex items-center gap-4 py-2">
        <div class="h-[1px] flex-1 bg-(--sub-alt) opacity-50" />
        <span class="text-xs font-medium text-(--sub) lowercase">or</span>
        <div class="h-[1px] flex-1 bg-(--sub-alt) opacity-50" />
      </div>

      <Input
        type="text"
        value={fields.usernameOrEmail}
        onInput={setField("usernameOrEmail")}
        placeholder="username or email"
        required
      />

      <Input
        type="password"
        value={fields.password}
        onInput={setField("password")}
        placeholder="password"
        required
      />

      <FormError message={error()} />

      <Button type="submit" class="h-12 w-full" disabled={submitting()}>
        {submitting() ? "signing in..." : "sign in"}
      </Button>
    </form>
  );
}
