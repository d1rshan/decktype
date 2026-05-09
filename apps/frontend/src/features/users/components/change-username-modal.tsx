import { z } from "zod";
import { X } from "lucide-solid";
import { Portal } from "solid-js/web";
import { Show, createEffect, createSignal, onCleanup } from "solid-js";

import { getFirstValidationMessage } from "@/features/auth/components/auth-forms/utils";
import { useAuthSession } from "@/features/auth/hooks";
import { api, toastApiError, unwrap } from "@/lib/api-client";
import { authClient } from "@/lib/auth-client";
import { toast } from "@/lib/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const changeUsernameSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters.")
    .max(30, "Username must be at most 30 characters.")
    .regex(
      /^[A-Za-z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores.",
    ),
});

type ChangeUsernameModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function ChangeUsernameModal(props: ChangeUsernameModalProps) {
  const auth = useAuthSession();
  const [username, setUsername] = createSignal("");
  const [validationMessage, setValidationMessage] = createSignal<string | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = createSignal(false);

  createEffect(() => {
    if (!props.isOpen) return;

    setUsername("");
    setValidationMessage(null);
    setIsSubmitting(false);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        props.onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    onCleanup(() => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    });
  });

  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault();

    const currentUsername = auth.username();

    const result = changeUsernameSchema.safeParse({
      username: username(),
    });

    if (!result.success) {
      setValidationMessage(getFirstValidationMessage(result.error.issues));
      return;
    }

    if (result.data.username === currentUsername) {
      setValidationMessage("Please choose a different username.");
      return;
    }

    setValidationMessage(null);
    setIsSubmitting(true);

    try {
      await unwrap(
        api.users.username.patch({
          username: result.data.username,
        }),
      );

      toast.success("Username updated successfully.");
      await authClient.getSession();
      props.onClose();
    } catch (error) {
      toastApiError(error);
      props.onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Show when={props.isOpen}>
      <Portal>
        <div class="fixed inset-0 z-50 flex items-center justify-center p-5">
          <button
            type="button"
            class="absolute inset-0 bg-(--bg)/90 backdrop-blur-[2px]"
            aria-label="Close change username modal"
            onClick={props.onClose}
          />

          <div class="relative w-full max-w-sm overflow-hidden rounded-xl bg-(--sub-alt) p-5">
            <div class="mb-4 flex items-center justify-between">
              <h3 class="text-lg font-bold text-(--main) lowercase">
                change username
              </h3>
              <Button
                type="button"
                onClick={props.onClose}
                class="h-7 w-7 bg-transparent p-0 text-(--sub) hover:bg-(--sub-alt) hover:text-(--main)"
              >
                <X size={18} />
              </Button>
            </div>

            <form class="flex flex-col gap-3" onSubmit={handleSubmit}>
              <p class="text-sm text-(--sub) opacity-70">
                you can only change your username once every 7 days.
              </p>

              <div class="flex gap-2">
                <div class="flex-1">
                  <Input
                    value={username()}
                    onInput={(event) => {
                      setUsername(event.currentTarget.value);
                      setValidationMessage(null);
                    }}
                    placeholder="change username..."
                    class="h-11 border border-(--main)/30 bg-transparent px-4"
                    error={Boolean(validationMessage())}
                    disabled={isSubmitting()}
                  />
                  <Show when={validationMessage()}>
                    {(message) => (
                      <p class="mt-1 text-xs text-(--error)">{message()}</p>
                    )}
                  </Show>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting()}
                  class="h-11 px-5 bg-(--main) text-(--sub-alt) hover:opacity-90"
                >
                  {isSubmitting() ? "..." : "save"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </Portal>
    </Show>
  );
}
