import { GameStat } from "@/features/games/components/GameStat";

export type HudProps = {
  score: number;
  typedValue: string;
};

export function Hud(props: HudProps) {
  return (
    <div class="flex items-center gap-12 font-mono">
      <GameStat label="score" value={props.score} highlight />
      <GameStat label="input" value={props.typedValue || "..."} />
    </div>
  );
}
