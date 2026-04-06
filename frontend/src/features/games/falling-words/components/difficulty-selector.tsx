import { cn } from '@/lib/cn'
import { difficultyOptions } from '../difficulty'
import type { DifficultyKey } from '../types'

type DifficultySelectorProps = {
  activeDifficulty: DifficultyKey
  onChange: (difficulty: DifficultyKey) => void
}

function DifficultySelector(props: DifficultySelectorProps) {
  return (
    <div class="t-label-strong flex items-center gap-1 rounded-xl bg-(--sub-alt) px-2 py-1.5 font-bold uppercase tracking-widest transition-all">
      {difficultyOptions.map((option) => (
        <button
          type="button"
          class={cn(
            'rounded-md px-4 py-2 uppercase',
            option.key === props.activeDifficulty
              ? 'text-(--text)'
              : 'text-(--sub) hover:text-(--text)',
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
