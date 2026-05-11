import { X } from "lucide-solid";
import { createEffect, onCleanup, Show } from "solid-js";
import { Portal } from "solid-js/web";

import { useAuthSession } from "@/features/auth/hooks";
import { createFormState } from "@/lib/form";
import { api, toastApiError, unwrap } from "@/lib/api-client";
import { toast } from "@/lib/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FormError from "@/components/ui/form-error";
import { usernameSchema } from "@/features/auth/components/schemas";

import { USERNAME_CHANGE_COOLDOWN_DAYS } from "../utils";

type ChangeUsernameModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function ChangeUsernameModal(props: ChangeUsernameModalProps) {
  const auth = useAuthSession();

  const {
    fields,
    setFields,
    setField,
    error,
    setError,
    submitting,
    setSubmitting,
    validate,
  } = createFormState({ username: "" });

  createEffect(() => {
    if (!props.isOpen) return;

    setFields("username", "");
    setError(null);
    setSubmitting(false);

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

  const handleSubmit = async (event: Event) => {
    event.preventDefault();

    const currentUsername = auth.username();
    const data = validate(usernameSchema);

    if (!data) {
      return;
    }

    if (data.username === currentUsername) {
      setError("Please choose a different username.");
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      await unwrap(
        api.users.username.patch({
          username: data.username,
        }),
      );

      toast.success("Username updated successfully.");
      window.location.replace(`/profile/${encodeURIComponent(data.username)}`);
    } catch (err) {
      toastApiError(err);
      props.onClose();
    } finally {
      setSubmitting(false);
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

          <div class="relative w-full max-w-sm overflow-hidden rounded-xl bg-(--sub-alt) p-4">
            <Button
              type="button"
              onClick={props.onClose}
              class="absolute top-3 right-3 h-7 w-7 bg-transparent p-0 text-(--sub) hover:bg-transparent hover:text-(--main)"
            >
              <X size={18} />
            </Button>

            <form class="flex flex-col gap-2.5" onSubmit={handleSubmit}>
              <p class="pr-8 text-sm leading-normal text-(--sub) opacity-70">
                you can only change your username once every{" "}
                {USERNAME_CHANGE_COOLDOWN_DAYS} days.
              </p>

              <div class="flex gap-2">
                <div class="flex-1">
                  <Input
                    value={fields.username}
                    onInput={setField("username")}
                    placeholder="new username"
                    class="h-10 border border-(--main)/30 bg-transparent px-4"
                    error={Boolean(error())}
                    disabled={submitting()}
                  />
                  <FormError message={error()} class="text-xs" />
                </div>

                <Button
                  type="submit"
                  disabled={submitting()}
                  class="h-10 px-4 bg-(--main) text-(--sub-alt) enabled:hover:opacity-90"
                >
                  {submitting() ? "..." : "save"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </Portal>
    </Show>
  );
}
