import { For } from "solid-js";

import { getGameName } from "@/features/games/utils";
import { formatDateTime } from "@/lib/utils";
import type { UserPBs } from "../types";

export function PersonalBestsCards(props: { pbs: UserPBs }) {
  const gameEntries = Object.entries(props.pbs);

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
                  <div class="rounded-lg bg-(--sub-alt) p-3">
                    <div class="mb-1 text-xs font-medium uppercase tracking-wider text-(--sub)">
                      {difficulty}
                    </div>
                    <div class="text-xl font-bold leading-none">
                      {pb.bestScore}
                    </div>
                    <div class="mt-1 text-xs leading-normal text-(--sub)">
                      {formatDateTime(pb.createdAt)}
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
