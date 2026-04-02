import { gameRegistry } from '../../entities/game/game-registry'

type GameSelectorProps = {
  onSelectGame: (slug: string) => void
}

function GameSelector(props: GameSelectorProps) {
  return (
    <div class="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {gameRegistry.map((game) => {
        const isLive = game.status === 'live'

        return (
          <button
            type="button"
            disabled={!isLive}
            class={`group relative flex flex-col items-start gap-6 rounded-3xl bg-[var(--sub-alt)]/20 p-10 text-left transition-all hover:bg-[var(--sub-alt)]/40 ${
              !isLive ? 'cursor-not-allowed opacity-40' : 'hover:-translate-y-1'
            }`}
            onClick={() => {
              if (isLive) {
                props.onSelectGame(game.slug)
              }
            }}
          >
            <div class="flex w-full items-start justify-between">
              <div class={`flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--bg)] text-[var(--sub)] transition-colors group-hover:text-[var(--main)]`}>
                {game.slug === 'falling-words' && (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 16.3c2.2 0 4-1.8 4-4 0-3.3-4-8-4-8s-4 4.7-4 8c0 2.2 1.8 4 4 4z"/><path d="M17 16.3c2.2 0 4-1.8 4-4 0-3.3-4-8-4-8s-4 4.7-4 8c0 2.2 1.8 4 4 4z"/></svg>
                )}
                {game.slug === 'quote-race' && (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"/><path d="M3 7V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2"/><path d="M9 17h6"/><path d="M10 13h4"/><path d="M11 9h2"/></svg>
                )}
                {game.slug === 'time-attack' && (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                )}
              </div>
              {!isLive && (
                <span class="rounded-full bg-[var(--bg)] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[var(--sub)]">
                  soon
                </span>
              )}
            </div>

            <div class="flex flex-col gap-3">
              <h2 class="text-2xl font-bold tracking-tight text-[var(--text)] group-hover:text-[var(--main)] transition-colors">
                {game.name.toLowerCase()}
              </h2>
              <p class="text-sm leading-relaxed text-[var(--sub)] opacity-80">
                {game.description.toLowerCase()}
              </p>
            </div>

            <div class="mt-4 flex items-center gap-4 text-[var(--sub)]">
              <div class="flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="opacity-40"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                <span class="text-[10px] font-bold uppercase tracking-widest">{game.defaultLanguage}</span>
              </div>
            </div>

            {isLive && (
              <div class="absolute bottom-10 right-10 translate-x-4 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="text-[var(--main)]"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </div>
            )}
          </button>
        )
      })}
    </div>
  )
}

export default GameSelector
