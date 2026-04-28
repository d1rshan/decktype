import { For, createSignal } from "solid-js";

import { gameRegistry } from "@/features/games/registry";
import type { LeaderboardDifficulty } from "@/features/leaderboard/types";
import { LeaderboardTable } from "@/features/leaderboard/components/leaderboard-table";
import { getGameName } from "@/features/games/utils";
import type { GameId } from "@/features/games/types";

const difficulties: LeaderboardDifficulty[] = ["easy", "medium", "hard"];

function LeaderboardPage() {
  const [gameId, setGameId] = createSignal<GameId>(
    gameRegistry[0]?.id ?? "falling-words",
  );

  const [difficulty, setDifficulty] =
    createSignal<LeaderboardDifficulty>("easy");

  return (
    <div class="w-full min-h-[72vh]">
      <div class="grid items-start gap-7 lg:grid-cols-[15rem_minmax(0,1fr)]">
        <aside class="space-y-4">
          <div class="rounded-lg bg-(--sub-alt) p-3">
            <div class="space-y-1.5">
              <For each={gameRegistry}>
                {(game) => (
                  <button
                    type="button"
                    class={`block w-full rounded-lg px-3 py-2 text-left text-sm leading-normal transition ${
                      gameId() === game.id
                        ? "bg-(--main) text-(--sub-alt)"
                        : "text-(--text) hover:bg-(--sub)/20"
                    }`}
                    onClick={() => setGameId(game.id)}
                  >
                    {game.name.toLowerCase()}
                  </button>
                )}
              </For>
            </div>
          </div>

          <div class="rounded-lg bg-(--sub-alt) p-3">
            <div class="space-y-1.5">
              <For each={difficulties}>
                {(level) => (
                  <button
                    type="button"
                    class={`block w-full rounded-lg px-3 py-2 text-left text-sm leading-normal tracking-wider transition ${
                      difficulty() === level
                        ? "bg-(--main) text-(--sub-alt)"
                        : "text-(--text) hover:bg-(--sub)/20"
                    }`}
                    onClick={() => setDifficulty(level)}
                  >
                    {level}
                  </button>
                )}
              </For>
            </div>
          </div>
        </aside>

        <section class="min-w-0">
          <div class="mb-5 border-b border-(--sub)/25 pb-5">
            <div class="capitalize">
              <h2 class="text-2xl leading-tight font-bold">
                {getGameName(gameId())} {difficulty()} leaderboard
              </h2>
            </div>
          </div>

          <LeaderboardTable gameId={gameId} difficulty={difficulty} />
        </section>
      </div>
    </div>
  );
}

export default LeaderboardPage;
