type GameHudProps = {
  score: number
  typedValue: string
}

function GameHud(props: GameHudProps) {
  return (
    <div class="flex items-center gap-12 font-mono">
      <div class="flex flex-col gap-1">
        <span class="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--sub)] opacity-50">
          score
        </span>
        <span class="text-2xl font-bold text-[var(--main)]">
          {props.score}
        </span>
      </div>

      <div class="flex flex-col gap-1">
        <span class="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--sub)] opacity-50">
          input
        </span>
        <span class="text-2xl font-bold text-[var(--text)]">
          {props.typedValue || '...'}
        </span>
      </div>
    </div>
  )
}

export default GameHud
