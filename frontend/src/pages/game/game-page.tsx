import TypingSession from '../../features/typing-session/typing-session'
import { getGameBySlug } from '../../entities/game/get-game-by-slug'

type GamePageProps = {
  slug: string
}

function GamePage(props: GamePageProps) {
  const gameDefinition = getGameBySlug(props.slug)

  if (!gameDefinition) {
    return (
      <div class="rounded-[2rem] border border-white/10 bg-white/6 p-8 text-white/70 backdrop-blur-xl">
        Unknown game route.
      </div>
    )
  }

  if (gameDefinition.status !== 'live') {
    return (
      <div class="rounded-[2rem] border border-white/10 bg-white/6 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
        <p class="text-[0.72rem] font-semibold tracking-[0.34em] text-[var(--accent-strong)] uppercase">
          Coming Soon
        </p>
        <h1 class="mt-4 font-display text-5xl tracking-[-0.04em] text-white">
          {gameDefinition.name}
        </h1>
        <p class="mt-5 max-w-2xl text-base leading-8 text-white/62">
          {gameDefinition.description}
        </p>
      </div>
    )
  }

  return <TypingSession game={gameDefinition} />
}

export default GamePage
