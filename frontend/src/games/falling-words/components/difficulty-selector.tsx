import { difficultyOptions } from '../difficulty'
import { cn } from '../../../shared/lib/cn'
import type { DifficultyKey } from '../types'

type DifficultySelectorProps = {
  activeDifficulty: DifficultyKey
  onChange: (difficulty: DifficultyKey) => void
}

function DifficultySelector(props: DifficultySelectorProps) {
  return (
    <div class="flex items-center gap-1 rounded-xl bg-[var(--sub-alt)] px-2 py-1.5 text-[11px] font-bold uppercase tracking-widest transition-all">
      {difficultyOptions.map((option) => (
        <button
          type="button"
          class={cn(
            'rounded-md px-4 py-2 uppercase',
            option.key === props.activeDifficulty
              ? 'text-[var(--text)]'
              : 'text-[var(--sub)] hover:text-[var(--text)]',
          )}
          onClick={() => props.onChange(option.key)}
        >
          {option.label.toUpperCase()}
        </button>
      ))}
    </div>
  )
}

export default DifficultySelector
