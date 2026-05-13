import { For } from "solid-js";

import { gameRegistry } from "@/features/games/registry";
import type { DifficultyKey } from "@/features/games/types";
import { formatDateTime } from "@/lib/utils";
import type { UserPBs } from "../types";

type PersonalBestCardProps = {
  name: string;
  difficultyKeys: readonly DifficultyKey[];
  pbs: Record<string, { bestScore: number; createdAt: Date }>;
};

export function PersonalBestCard(props: PersonalBestCardProps) {
  return (
    <div class="group relative rounded-xl bg-(--sub-alt) px-6 py-4 transition-colors sm:px-8 sm:py-5">
      <div class="flex flex-col gap-4 sm:gap-5">
        <h3 class="text-[10px] font-bold text-(--sub) opacity-60 sm:text-xs">
          {props.name}
        </h3>

        <div
          class="grid gap-y-6"
          style={{
            "grid-template-columns": `repeat(${props.difficultyKeys.length}, minmax(0, 1fr))`,
          }}
        >
          <For each={props.difficultyKeys}>
            {(difficulty) => (
              <div class="flex flex-col items-center gap-1 text-center">
                <div class="text-[10px] font-bold uppercase tracking-widest text-(--sub) opacity-60">
                  {difficulty}
                </div>
                <div
                  class={`text-2xl font-bold leading-none tracking-tighter sm:text-4xl ${
                    !props.pbs[difficulty]
                      ? "text-(--sub) opacity-15"
                      : "text-(--text)"
                  }`}
                >
                  {props.pbs[difficulty]
                    ? props.pbs[difficulty].bestScore
                    : "-"}
                </div>
                <div class="text-[10px] font-medium tracking-wider text-(--sub) opacity-50 sm:text-[11px]">
                  {props.pbs[difficulty] ? (
                    <span>
                      {formatDateTime(props.pbs[difficulty].createdAt)}
                    </span>
                  ) : (
                    "-"
                  )}
                </div>
              </div>
            )}
          </For>
        </div>
      </div>
    </div>
  );
}

export function PersonalBestsCards(props: { pbs: UserPBs }) {
  return (
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <For each={gameRegistry}>
        {(game) => (
          <PersonalBestCard
            name={game.name}
            difficultyKeys={game.difficultyKeys}
            pbs={props.pbs[game.id] || {}}
          />
        )}
      </For>
    </div>
  );
}
