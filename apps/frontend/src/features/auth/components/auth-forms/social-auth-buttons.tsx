import { createSignal, Show } from "solid-js";
import { FaBrandsGoogle, FaBrandsGithub } from "solid-icons/fa";

import Button from "@/components/ui/button";
import { getErrorMessage } from "@/lib/api-client";
import { authClient } from "@/lib/auth-client";

type OAuthProvider = "google" | "github";

export function SocialAuthButtons() {
  const [pendingProvider, setPendingProvider] =
    createSignal<OAuthProvider | null>(null);
  const [errorMessage, setErrorMessage] = createSignal<string | null>(null);

  const signInWithProvider = async (provider: OAuthProvider) => {
    setPendingProvider(provider);
    setErrorMessage(null);

    try {
      const result = await authClient.signIn.social({
        provider,
      });

      if (result.error) {
        setErrorMessage(result.error.message ?? "Unable to sign in.");
      }
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setPendingProvider(null);
    }
  };

  return (
    <div class="flex flex-col gap-3">
      <div class="grid grid-cols-2 gap-3">
        <Button
          type="button"
          class="h-12"
          disabled={Boolean(pendingProvider())}
          onClick={() => void signInWithProvider("google")}
          title="Sign in with Google"
        >
          <Show
            when={pendingProvider() === "google"}
            fallback={<FaBrandsGoogle size={18} />}
          >
            <span class="text-xs">opening...</span>
          </Show>
        </Button>
        <Button
          type="button"
          class="h-12"
          disabled={Boolean(pendingProvider())}
          onClick={() => void signInWithProvider("github")}
          title="Sign in with GitHub"
        >
          <Show
            when={pendingProvider() === "github"}
            fallback={<FaBrandsGithub size={18} />}
          >
            <span class="text-xs">opening...</span>
          </Show>
        </Button>
      </div>

      <Show when={errorMessage()}>
        {(message) => (
          <div class="text-(--error)">
            <p class="text-sm leading-normal">{message()}</p>
          </div>
        )}
      </Show>
    </div>
  );
}
