import { Button } from "@/components/ui/button";
import { PersonalBestsCards } from "@/features/users/pbs/components/personal-bests";

import { ProfileHero } from "./profile-hero";
import type { ProfileData } from "./types";

type PublicProfileViewProps = {
  data: ProfileData;
  onNavigateHome: () => void;
};

export function PublicProfileView(props: PublicProfileViewProps) {
  return (
    <div class="flex w-full flex-1 items-center">
      <div class="flex w-full flex-col gap-8">
        <section class="space-y-5">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <h2 class="text-2xl leading-tight font-bold capitalize">profile</h2>
            <div class="flex flex-wrap gap-3">
              <Button class="h-8 px-3 text-xs" onClick={props.onNavigateHome}>
                back home
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
      </div>
    </div>
  );
}
