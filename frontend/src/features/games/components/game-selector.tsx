import { gameRegistry } from '@/features/games/registry'
import { getWordBank } from '@/features/content/word-banks/manager'
import type { GameId } from '@/features/games/types'

type GameSelectorProps = {
  activeGameId?: GameId | null
  onSelectGame: (gameId: GameId) => void
}

function GameCardIcon(props: { gameId: GameId }) {
  if (props.gameId === 'falling-words') {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M7 16.3c2.2 0 4-1.8 4-4 0-3.3-4-8-4-8s-4 4.7-4 8c0 2.2 1.8 4 4 4z" />
        <path d="M17 16.3c2.2 0 4-1.8 4-4 0-3.3-4-8-4-8s-4 4.7-4 8c0 2.2 1.8 4 4 4z" />
      </svg>
    )
  }

  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

function GameSelector(props: GameSelectorProps) {
  return (
    <div class="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {gameRegistry.map((game) => {
        const isLive = game.status === 'live'
        const isActive = props.activeGameId === game.id
        const wordBank = getWordBank(game.defaultWordBankId)

        return (
          <button
            type="button"
            disabled={!isLive}
            class={`group relative flex flex-col items-start gap-6 rounded-3xl p-10 text-left transition-all ${
              isActive
                ? 'bg-[var(--sub-alt)]/40 ring-1 ring-[var(--main)]/30'
                : 'bg-[var(--sub-alt)]/20 hover:bg-[var(--sub-alt)]/40'
            } ${!isLive ? 'cursor-not-allowed opacity-40' : 'hover:-translate-y-1'
            }`}
            onClick={() => {
              if (isLive) {
                props.onSelectGame(game.id)
              }
            }}
          >
            <div class="flex w-full items-start justify-between">
              <div class={`flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--bg)] text-[var(--sub)] transition-colors group-hover:text-[var(--main)]`}>
                <GameCardIcon gameId={game.id} />
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
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="opacity-40"><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
                <span class="text-[10px] font-bold uppercase tracking-widest">
                  {wordBank?.label ?? game.defaultWordBankId}
                </span>
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
