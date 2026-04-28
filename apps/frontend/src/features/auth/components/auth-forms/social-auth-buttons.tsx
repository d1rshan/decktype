import { createSignal, For, Show } from "solid-js";
import { Code, Globe } from "lucide-solid";

import Button from "@/components/ui/button";
import { getErrorMessage } from "@/lib/api-client";
import { authClient } from "@/lib/auth-client";

type OAuthProvider = "google" | "github";

const providers: {
  id: OAuthProvider;
  label: string;
  Icon: typeof Globe;
}[] = [
  { id: "google", label: "google", Icon: Globe },
  { id: "github", label: "github", Icon: Code },
];

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
    <div class="mx-auto flex w-full max-w-sm flex-col gap-3">
      <span class="text-xs leading-none font-semibold tracking-widest uppercase">
        continue with
      </span>
      <div class="grid grid-cols-2 gap-3">
        <For each={providers}>
          {(provider) => (
            <Button
              type="button"
              class="h-12 gap-2"
              disabled={Boolean(pendingProvider())}
              onClick={() => void signInWithProvider(provider.id)}
            >
              <provider.Icon size={16} strokeWidth={2.2} />
              {pendingProvider() === provider.id ? "opening..." : provider.label}
            </Button>
          )}
        </For>
      </div>
      <Show when={errorMessage()}>
        {(message) => (
          <div class="pt-1 text-(--error)">
            <p class="text-base leading-normal">{message()}</p>
          </div>
        )}
      </Show>
    </div>
  );
}
