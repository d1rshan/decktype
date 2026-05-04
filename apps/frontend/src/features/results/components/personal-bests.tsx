import { For, Show } from "solid-js";

import { useAuthSession } from "@/features/auth/hooks";
import { usePersonalBestsQuery } from "@/features/results/api/personal-bests";
import { getGameName } from "@/features/games/utils";
import { QueryState } from "@/components/query-state";

type PBEntry = {
  bestScore: number;
  createdAt: string | Date;
};

type PBsByDifficulty = Record<string, PBEntry>;

type UserPBs = Record<string, PBsByDifficulty>;

function formatPBDateTime(value: string | Date) {
  const date = new Date(value);
  const month = date.toLocaleString(undefined, { month: "short" });

  return `${date.getDate()} ${month} ${date.getFullYear()}`;
}

function PersonalBestsTable(pbs: UserPBs) {
  const gameEntries = Object.entries(pbs);

  return (
    <div class="flex flex-col gap-4">
      <For each={gameEntries}>
        {([gameId, difficulties]) => (
          <div class="space-y-2">
            <h3 class="text-base font-semibold text-(--sub)">
              {getGameName(gameId)}
            </h3>
            <div class="grid grid-cols-3 gap-2">
              <For each={Object.entries(difficulties)}>
                {([difficulty, pb]) => (
                  <div class="rounded-lg bg-(--sub-alt)/50 p-3">
                    <div class="mb-1 text-xs font-medium uppercase tracking-wider text-(--sub)">
                      {difficulty}
                    </div>
                    <div class="text-xl font-bold leading-none">
                      {pb.bestScore}
                    </div>
                    <div class="mt-1 text-xs leading-normal text-(--sub)">
                      {formatPBDateTime(pb.createdAt)}
                    </div>
                  </div>
                )}
              </For>
            </div>
          </div>
        )}
      </For>
    </div>
  );
}

function PersonalBests() {
  const auth = useAuthSession();
  const pbsQuery = usePersonalBestsQuery({
    enabled: auth.isAuthenticated,
  });

  return (
    <QueryState query={pbsQuery} emptyMessage="no personal bests yet">
      {(data) => (
        <Show
          when={Object.keys(data.pbs).length > 0}
          fallback={
            <p class="text-base leading-normal text-(--sub)">
              no personal bests yet
            </p>
          }
        >
          {PersonalBestsTable(data.pbs)}
        </Show>
      )}
    </QueryState>
  );
}

export default PersonalBests;
