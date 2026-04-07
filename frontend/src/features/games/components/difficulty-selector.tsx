import { cn } from '@/lib/cn'
import { Text } from '@/components/ui/text'

type DifficultySelectorProps<T extends string> = {
  options: readonly T[]
  activeDifficulty: T
  onChange: (difficulty: T) => void
}

export function DifficultySelector<T extends string>(props: DifficultySelectorProps<T>) {
  return (
    <div class="flex items-center gap-1 rounded-xl bg-(--sub-alt) px-2 py-1.5 transition-all">
      {props.options.map((difficulty) => (
        <button
          type="button"
          class={cn(
            'rounded-md px-4 py-2',
            difficulty === props.activeDifficulty
              ? 'text-(--text)'
              : 'text-(--sub) hover:text-(--text)',
          )}
          onClick={() => props.onChange(difficulty)}
        >
          <Text variant="label" upper>{difficulty}</Text>
        </button>
      ))}
    </div>
  )
}
