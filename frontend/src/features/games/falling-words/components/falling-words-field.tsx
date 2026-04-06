import type { FallingWord, GamePhase } from '../types'

type FallingWordsFieldProps = {
  ref?: (el: HTMLDivElement) => void
  words: FallingWord[]
  currentInput: string
  phase: GamePhase
  score: number
  onFieldClick: () => void
}

function FallingWordsField(props: FallingWordsFieldProps) {
  const focusedWordId = () => {
    if (props.currentInput.length === 0) {
      return null
    }

    const candidates = props.words
      .filter((word) => word.text.startsWith(props.currentInput))
      .sort((left, right) => right.y - left.y)

    return candidates[0]?.id ?? null
  }

  return (
    <div
      ref={props.ref}
      class="absolute inset-0 z-0 h-full w-full cursor-text overflow-hidden bg-[var(--bg)]"
      onClick={props.onFieldClick}
    >
      {props.phase === 'idle' && (
        <div class="absolute inset-0 flex items-center justify-center p-6 text-center">
          <div class="flex items-center gap-2 text-sm text-[var(--sub)]">
            <span class="rounded bg-[var(--sub-alt)] px-2 py-1 text-xs">enter</span>
            <span>to start</span>
          </div>
        </div>
      )}

      {props.phase === 'game-over' && (
        <div class="absolute inset-0 z-20 flex items-center justify-center bg-[var(--bg)]/90 backdrop-blur-sm">
          <div class="text-center">
            <p class="text-[10px] font-bold tracking-[0.5em] text-[var(--sub)] uppercase">
              final score
            </p>
            <p class="mt-4 text-8xl font-bold tracking-tighter text-[var(--main)] sm:text-9xl">
              {props.score}
            </p>
            <div class="mt-12 flex flex-col items-center gap-4">
              <div class="flex items-center gap-2 text-sm text-[var(--sub)]">
                <span class="rounded bg-[var(--sub-alt)] px-2 py-1 text-xs">enter</span>
                <span>to restart</span>
              </div>
              <p class="text-[10px] tracking-widest text-[var(--sub)] uppercase opacity-50">
                esc to reset
              </p>
            </div>
          </div>
        </div>
      )}

      {props.phase === 'paused' && (
        <div class="absolute inset-0 z-20 flex items-center justify-center bg-[var(--bg)]/30 backdrop-blur-[2px]">
          <div class="text-center">
            <p class="text-[10px] font-bold tracking-[0.5em] text-[var(--sub)] uppercase">
              paused
            </p>
            <p class="mt-4 text-6xl font-bold tracking-tighter text-[var(--main)] sm:text-7xl">
              {props.score}
            </p>
            <div class="mt-10 flex items-center justify-center gap-2 text-sm text-[var(--sub)]">
              <span class="rounded bg-[var(--sub-alt)] px-2 py-1 text-xs">enter</span>
              <span>to resume</span>
            </div>
          </div>
        </div>
      )}

      {props.words.map((word) => {
        const isFocused = word.id === focusedWordId()
        const isPrefixMatch =
          props.currentInput.length > 0 && word.text.startsWith(props.currentInput)
        const isExactMatch =
          props.currentInput.length > 0 && word.text === props.currentInput
        const typedLength = isFocused ? props.currentInput.length : 0
        const characters = word.text.split('')

        return (
          <div
            class={`absolute font-mono text-2xl tracking-tight transition-all duration-150 ${
              isExactMatch
                ? 'text-[var(--main)]'
                : isFocused
                  ? 'text-[var(--text)]'
                  : isPrefixMatch
                    ? 'text-[var(--text)] opacity-60'
                    : 'text-[var(--sub)] opacity-40'
            }`}
            style={{
              transform: `translate(${word.x}px, ${word.y}px) rotate(${word.rotation}deg)`,
            }}
          >
            <span class="relative inline-flex items-center">
              {characters.map((character, index) => {
                const isTyped = isFocused && index < typedLength
                const isCaretSlot = isFocused && index === typedLength

                return (
                  <span
                    class={`relative transition-colors duration-200 ${
                      isTyped
                        ? 'text-[var(--main)]'
                        : isCaretSlot
                          ? 'text-[var(--text)]'
                          : 'text-inherit'
                    }`}
                  >
                    {isCaretSlot && (
                      <span class="absolute bottom-[-2px] left-0 h-[2px] w-full bg-[var(--main)] animate-pulse" />
                    )}
                    {character}
                  </span>
                )
              })}

              {isFocused && typedLength === characters.length && (
                <span class="ml-[1px] h-[1em] w-[2px] bg-[var(--main)] animate-pulse" />
              )}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export default FallingWordsField
