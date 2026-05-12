import type { Component } from "solid-js";
import { Index } from "solid-js";
import { PixelHeart } from "./pixel-heart";

export type SurvivalHudProps = {
  health: number; // 0 to 5
  score: number;
  wpm: number;
  accuracy: number;
  isTakingDamage?: boolean;
};

export const SurvivalHud: Component<SurvivalHudProps> = (props) => {
  return (
    <div class="flex items-center gap-12 font-mono">
      <div class="flex flex-col gap-1">
        <div class="opacity-50">
          <span class="text-xs leading-none font-semibold tracking-widest uppercase">
            score
          </span>
        </div>
        <div class="text-(--main)">
          <h2 class="text-2xl leading-tight font-bold">
            {props.score.toLocaleString()}
          </h2>
        </div>
      </div>

      <div class="flex flex-col gap-1">
        <div class="opacity-50">
          <span class="text-xs leading-none font-semibold tracking-widest uppercase">
            acc
          </span>
        </div>
        <div class="text-(--text)">
          <h2 class="text-2xl leading-tight font-bold">
            {Math.round(props.accuracy * 100)}%
          </h2>
        </div>
      </div>

      <div class="flex flex-col gap-1">
        <div class="opacity-50">
          <span class="text-xs leading-none font-semibold tracking-widest uppercase">
            wpm
          </span>
        </div>
        <div class="text-(--text)">
          <h2 class="text-2xl leading-tight font-bold">{props.wpm}</h2>
        </div>
      </div>

      <div class="flex flex-col gap-1">
        <div class="opacity-50">
          <span class="text-xs leading-none font-semibold tracking-widest uppercase">
            health
          </span>
        </div>
        <div class="flex items-center gap-1">
          <Index each={Array.from({ length: 5 })}>
            {(_, i) => (
              <PixelHeart
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
};
