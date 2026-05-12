export type GameStatProps = {
  label: string;
  value: string | number;
  highlight?: boolean;
};

export function GameStat(props: GameStatProps) {
  return (
    <div class="flex flex-col gap-1">
      <div class="opacity-50">
        <span class="text-xs leading-none font-semibold tracking-widest uppercase">
          {props.label}
        </span>
      </div>
      <div class={props.highlight ? "text-(--main)" : "text-(--text)"}>
        <h2 class="text-2xl leading-tight font-bold">{props.value}</h2>
      </div>
    </div>
  );
}
