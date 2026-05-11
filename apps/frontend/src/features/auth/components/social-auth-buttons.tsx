import { createSignal, For, Show } from "solid-js";
import { FaBrandsGoogle, FaBrandsGithub } from "solid-icons/fa";

import Button from "@/components/ui/button";
import FormError from "@/components/ui/form-error";
import { getErrorMessage } from "@/lib/api-client";
import { authClient } from "@/lib/auth-client";
import { urls } from "@/lib/urls";

const PROVIDERS = [
  { id: "google", icon: FaBrandsGoogle, label: "Google" },
  { id: "github", icon: FaBrandsGithub, label: "GitHub" },
] as const;

export function SocialAuthButtons() {
  const [pending, setPending] = createSignal<string | null>(null);
  const [error, setError] = createSignal<string | null>(null);

  const handleSignIn = async (provider: (typeof PROVIDERS)[number]["id"]) => {
    setPending(provider);
    setError(null);

    try {
      const result = await authClient.signIn.social({
        provider,
        callbackURL: urls.frontend,
      });

      if (result.error) {
        setError(result.error.message ?? "Authentication failed.");
      }
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setPending(null);
    }
  };

  return (
    <div class="flex flex-col gap-3">
      <div class="grid grid-cols-2 gap-3">
        <For each={PROVIDERS}>
          {(p) => (
            <Button
              type="button"
              class="h-12"
              disabled={Boolean(pending())}
              onClick={() => void handleSignIn(p.id)}
              aria-label={`Sign in with ${p.label}`}
              title={`Sign in with ${p.label}`}
            >
              <Show when={pending() === p.id} fallback={<p.icon size={18} />}>
                <span class="text-xs">opening...</span>
              </Show>
            </Button>
          )}
        </For>
      </div>

      <FormError message={error()} />
    </div>
  );
}
