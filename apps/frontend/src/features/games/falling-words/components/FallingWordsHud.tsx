import { GameStat } from "@/features/games/components/GameStat";

export type FallingWordsHudProps = {
  score: number;
  typedValue: string;
};

export function FallingWordsHud(props: FallingWordsHudProps) {
  return (
    <div class="flex items-center gap-12 font-mono">
      <GameStat label="score" value={props.score} highlight />
      <GameStat label="input" value={props.typedValue || "..."} />
    </div>
  );
}
