import { useNavigate } from "@solidjs/router";
import { Show, createSignal } from "solid-js";

import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { PersonalBestsCards } from "@/features/users/pbs/components/personal-bests";
import { ResultsTableUi } from "@/features/users/results/components/results-table";
import { getErrorMessage } from "@/lib/api-client";
import { authClient } from "@/lib/auth-client";

import { useUsernameChangeCooldown } from "../hooks";
import { ChangeUsernameModal } from "./change-username-modal";
import { ProfileHero } from "./profile-hero";
import type { ProfileData } from "./types";

type OwnProfileViewProps = {
  data: ProfileData;
};

export function OwnProfileView(props: OwnProfileViewProps) {
  const navigate = useNavigate();
  const [isSigningOut, setIsSigningOut] = createSignal(false);
  const [isUsernameModalOpen, setIsUsernameModalOpen] = createSignal(false);
  const [statusMessage, setStatusMessage] = createSignal<string | null>(null);
  const [errorMessage, setErrorMessage] = createSignal<string | null>(null);

  const { canChangeUsername, tooltip: usernameChangeTooltip } =
    useUsernameChangeCooldown();

  const handleSignOut = async () => {
    setStatusMessage(null);
    setErrorMessage(null);
    setIsSigningOut(true);

    try {
      const result = await authClient.signOut();

      if (result.error) {
        setErrorMessage(result.error.message ?? "Unable to sign out.");
        return;
      }

      setStatusMessage("Signed out.");
      navigate("/", { replace: true });
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <div class="flex w-full flex-col gap-8">
      <section class="space-y-5">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <h2 class="text-2xl leading-tight font-bold capitalize">profile</h2>
          <div class="flex flex-wrap gap-3">
            <Button
              class="h-8 px-3 text-xs"
              onClick={() => navigate("/", { replace: true })}
            >
              back home
            </Button>
            <Tooltip
              content={usernameChangeTooltip()}
              disabled={canChangeUsername()}
            >
              <Button
                class="h-8 px-3 text-xs"
                onClick={() => setIsUsernameModalOpen(true)}
                disabled={!canChangeUsername()}
              >
                change username
              </Button>
            </Tooltip>
            <Button
              class="h-8 px-3 text-xs"
              onClick={handleSignOut}
              disabled={isSigningOut()}
            >
              {isSigningOut() ? "signing out..." : "sign out"}
            </Button>
          </div>
        </div>

        <ProfileHero
          username={props.data.user.username}
          image={props.data.user.image}
          joinedAt={props.data.user.createdAt}
        />
      </section>

      <section class="space-y-4">
        <h2 class="text-2xl leading-tight font-bold capitalize">
          personal bests
        </h2>
        <PersonalBestsCards pbs={props.data.pbs} />
      </section>

      <section class="space-y-4">
        <h2 class="text-2xl leading-tight font-bold capitalize">
          recent results
        </h2>
        <ResultsTableUi results={props.data.results} />
      </section>

      <Show when={statusMessage()}>
        {(message) => (
          <div>
            <p class="text-base leading-normal text-(--main)">{message()}</p>
          </div>
        )}
      </Show>

      <Show when={errorMessage()}>
        {(message) => (
          <div>
            <p class="text-base leading-normal text-(--error)">{message()}</p>
          </div>
        )}
      </Show>

      <ChangeUsernameModal
        isOpen={isUsernameModalOpen()}
        onClose={() => setIsUsernameModalOpen(false)}
      />
    </div>
  );
}
