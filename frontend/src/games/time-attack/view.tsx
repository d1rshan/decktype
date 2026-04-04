import type { GameViewProps } from '../types'

function TimeAttackView(_: GameViewProps) {
  return (
    <div class="rounded-[2rem] border border-white/10 bg-white/6 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
      <p class="text-[0.72rem] font-semibold tracking-[0.34em] text-[var(--accent-strong)] uppercase">
        Coming Soon
      </p>
      <h1 class="mt-4 font-display text-5xl tracking-[-0.04em] text-white">
        time attack
      </h1>
      <p class="mt-5 max-w-2xl text-base leading-8 text-white/62">
        A short sprint mode tuned for raw speed and rapid resets.
      </p>
    </div>
  )
}

export default TimeAttackView
