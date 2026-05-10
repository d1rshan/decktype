import { Show } from "solid-js";

import { Button } from "@/components/ui/button";
import { PersonalBestsCards } from "@/features/users/pbs/components/personal-bests";
import { ResultsTableUi } from "@/features/users/results/components/results-table";

import { ChangeUsernameModal } from "./change-username-modal";
import { ProfileHero } from "./profile-hero";
import type { ProfileData } from "./types";

type OwnProfileViewProps = {
  data: ProfileData;
  isSigningOut: boolean;
  statusMessage: string | null;
  errorMessage: string | null;
  isUsernameModalOpen: boolean;
  onNavigateHome: () => void;
  onOpenUsernameModal: () => void;
  onCloseUsernameModal: () => void;
  onSignOut: () => void;
  onUsernameChangeSuccess: (username: string) => void;
};

export function OwnProfileView(props: OwnProfileViewProps) {
  return (
    <div class="flex w-full flex-col gap-8">
      <section class="space-y-5">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <h2 class="text-2xl leading-tight font-bold capitalize">profile</h2>
          <div class="flex flex-wrap gap-3">
            <Button class="h-8 px-3 text-xs" onClick={props.onNavigateHome}>
              back home
            </Button>
            <Button
              class="h-8 px-3 text-xs"
              onClick={props.onOpenUsernameModal}
            >
              change username
            </Button>
            <Button
              class="h-8 px-3 text-xs"
              onClick={props.onSignOut}
              disabled={props.isSigningOut}
            >
              {props.isSigningOut ? "signing out..." : "sign out"}
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

      <Show when={props.statusMessage}>
        {(message) => (
          <div>
            <p class="text-base leading-normal text-(--main)">{message()}</p>
          </div>
        )}
      </Show>

      <Show when={props.errorMessage}>
        {(message) => (
          <div>
            <p class="text-base leading-normal text-(--error)">{message()}</p>
          </div>
        )}
      </Show>

      <ChangeUsernameModal
        isOpen={props.isUsernameModalOpen}
        onClose={props.onCloseUsernameModal}
        onSuccess={props.onUsernameChangeSuccess}
      />
    </div>
  );
}
