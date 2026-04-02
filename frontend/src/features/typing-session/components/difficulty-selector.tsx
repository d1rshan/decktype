import { difficultyOptions } from '../games/falling-words/falling-words-game'
import type { DifficultyKey } from '../games/falling-words/types'

type DifficultySelectorProps = {
  activeDifficulty: DifficultyKey
  onChange: (difficulty: DifficultyKey) => void
}

function DifficultyIcon(props: { difficulty: DifficultyKey }) {
  if (props.difficulty === 'easy') {
    return (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>
      </svg>
    )
  }
  if (props.difficulty === 'medium') {
    return (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.77 3.77z"/>
      </svg>
    )
  }
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
      <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>
    </svg>
  )
}

function DifficultySelector(props: DifficultySelectorProps) {
  return (
    <div class="flex items-center gap-1 rounded-xl bg-[var(--sub-alt)] px-2 py-1.5 text-[11px] font-bold uppercase tracking-widest transition-all">
      {difficultyOptions.map((option) => {
        return (
          <button
            type="button"
            class={`flex items-center gap-2 rounded-md px-4 py-2 transition-all uppercase ${
              option.key === props.activeDifficulty
                ? 'text-[var(--main)]'
                : 'text-[var(--sub)] hover:text-[var(--text)]'
            }`}
            onClick={() => props.onChange(option.key)}
          >
            <DifficultyIcon difficulty={option.key} />
            {option.label.toUpperCase()}
          </button>
        )
      })}
    </div>
  )
}

export default DifficultySelector
