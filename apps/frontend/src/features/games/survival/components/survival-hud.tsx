import { Index } from "solid-js";
import { Heart } from "./heart";
import { GameStat } from "@/features/games/components/game-stat";

export type SurvivalHudProps = {
  health: number;
  score: number;
  wpm: number;
  accuracy: number;
  isTakingDamage?: boolean;
};

export function SurvivalHud(props: SurvivalHudProps) {
  return (
    <div class="flex items-center gap-12 font-mono">
      <GameStat label="score" value={props.score.toLocaleString()} highlight />
      <GameStat label="acc" value={`${Math.round(props.accuracy * 100)}%`} />
      <GameStat label="wpm" value={props.wpm} />

      <div class="flex flex-col gap-1">
        <div class="opacity-50">
          <span class="text-xs leading-none font-semibold tracking-widest uppercase">
            health
          </span>
        </div>
        <div class="flex items-center gap-1">
          <Index each={Array.from({ length: 5 })}>
            {(_, i) => (
              <Heart
                state={
                  props.health - i >= 1
                    ? "full"
                    : props.health - i > 0
                      ? "half"
                      : "empty"
                }
                isDamaged={props.isTakingDamage}
                class="h-6 w-6"
              />
            )}
          </Index>
        </div>
      </div>
    </div>
  );
}
