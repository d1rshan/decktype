import { Kbd } from "@/components/ui/kbd";

export type GameOverProps = {
  score: number;
};

export function GameOver(props: GameOverProps) {
  return (
    <div class="absolute inset-0 z-20 flex items-center justify-center bg-(--bg)/90 backdrop-blur-sm">
      <div class="text-center">
        <p class="text-6xl leading-none font-bold tracking-tighter text-(--main) sm:text-8xl">
          {props.score.toLocaleString()}
        </p>
        <div class="mt-12 flex flex-col items-center gap-4">
          <div class="flex items-center gap-2">
            <Kbd>enter</Kbd>
            <p class="text-base leading-normal">to restart</p>
          </div>
        </div>
      </div>
    </div>
  );
}
