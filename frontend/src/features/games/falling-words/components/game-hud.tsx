type GameHudProps = {
  score: number
  typedValue: string
}

function GameHud(props: GameHudProps) {
  return (
    <div class="flex items-center gap-12 font-mono">
      <div class="flex flex-col gap-1">
        <span class="t-label font-bold uppercase tracking-[0.2em] text-(--sub) opacity-50">
          score
        </span>
        <span class="t-title font-bold text-(--main)">
          {props.score}
        </span>
      </div>

      <div class="flex flex-col gap-1">
        <span class="t-label font-bold uppercase tracking-[0.2em] text-(--sub) opacity-50">
          input
        </span>
        <span class="t-title font-bold text-(--text)">
          {props.typedValue || '...'}
        </span>
      </div>
    </div>
  )
}

export default GameHud
