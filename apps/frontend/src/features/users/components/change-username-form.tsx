import { createForm } from "@tanstack/solid-form";
import { Show, createSignal } from "solid-js";

import {
  changeUsernameSchema,
  usernameSchema,
} from "@/features/auth/components/auth-forms/schemas";
import { getFirstValidationMessage } from "@/features/auth/components/auth-forms/utils";
import { useAuthSession } from "@/features/auth/hooks";
import { api, getErrorMessage, unwrap } from "@/lib/api-client";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ChangeUsernameForm(props: { onCancel: () => void }) {
  const auth = useAuthSession();
  const [statusMessage, setStatusMessage] = createSignal<string | null>(null);
  const [errorMessage, setErrorMessage] = createSignal<string | null>(null);

  const form = createForm(() => ({
    defaultValues: {
      username: auth.user()?.displayUsername || "",
    },
    onSubmit: async ({ value }) => {
      setStatusMessage(null);
      setErrorMessage(null);

      try {
        await unwrap(
          api.users.username.patch({
            username: value.username.trim(),
          }),
        );

        setStatusMessage("Username updated successfully.");
        // Refresh session to get new username
        await authClient.getSession();
        // Give time to see success message then close
        setTimeout(() => props.onCancel(), 1500);
      } catch (error) {
        setErrorMessage(getErrorMessage(error));
      }
    },
  }));

  const formState = form.useStore((state) => ({
    isSubmitting: state.isSubmitting,
    submissionAttempts: state.submissionAttempts,
  }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void form.handleSubmit();
      }}
      class="flex flex-col gap-3"
    >
      <div class="space-y-2">
        <p class="text-sm text-(--sub) opacity-70">
          you can only change your username once every 7 days.
        </p>
        <div class="flex gap-2">
          <form.Field
            name="username"
            validators={{
              onChange: usernameSchema,
            }}
          >
            {(field) => {
              const validationMessage = getFirstValidationMessage(
                field().state.meta.errors,
              );
              const hasError = Boolean(
                validationMessage && formState().submissionAttempts > 0,
              );

              return (
                <div class="flex-1">
                  <Input
                    value={field().state.value}
                    onInput={(e) => field().handleChange(e.currentTarget.value)}
                    onBlur={field().handleBlur}
                    placeholder="change username..."
                    class="h-11 border border-(--main)/30 bg-transparent px-4"
                    error={hasError}
                  />
                  <Show when={hasError}>
                    <p class="mt-1 text-xs text-(--error)">
                      {validationMessage}
                    </p>
                  </Show>
                </div>
              );
            }}
          </form.Field>
          <Button
            type="submit"
            disabled={formState().isSubmitting}
            class="h-11 px-5 bg-(--main) text-(--sub-alt) hover:opacity-90"
          >
            {formState().isSubmitting ? "..." : "save"}
          </Button>
        </div>
      </div>

      <div class="flex items-center justify-end gap-2 px-1">
        <Show when={statusMessage()}>
          {(message) => <p class="text-[10px] text-(--main)">{message()}</p>}
        </Show>
        <Show when={errorMessage()}>
          {(message) => <p class="text-[10px] text-(--error)">{message()}</p>}
        </Show>
      </div>
    </form>
  );
}
