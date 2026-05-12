type GameHudProps = {
  score: number;
  typedValue: string;
};

function GameHud(props: GameHudProps) {
  return (
    <div class="flex items-center gap-12 font-mono">
      <div class="flex flex-col gap-1">
        <div class="opacity-50">
          <span class="text-xs leading-none font-semibold tracking-widest uppercase">
            score
          </span>
        </div>
        <div class="text-(--main)">
          <h2 class="text-2xl leading-tight font-bold">{props.score}</h2>
        </div>
      </div>

      <div class="flex flex-col gap-1">
        <div class="opacity-50">
          <span class="text-xs leading-none font-semibold tracking-widest uppercase">
            input
          </span>
        </div>
        <h2 class="text-2xl leading-tight font-bold">
          {props.typedValue || "..."}
        </h2>
      </div>
    </div>
  );
}

export default GameHud;
