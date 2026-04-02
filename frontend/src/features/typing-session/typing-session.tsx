import type { GameDefinition } from '../../entities/game/types'
import DifficultySelector from './components/difficulty-selector'
import FallingWordsField from './components/falling-words-field'
import GameHud from './components/game-hud'
import { useTypingSession } from './use-typing-session'

type TypingSessionProps = {
  game: GameDefinition
}

function TypingSession(props: TypingSessionProps) {
  const session = useTypingSession(props.game)

  return (
    <div class="flex flex-col gap-8">
      <div class="flex flex-col items-center gap-6">
        <DifficultySelector
          activeDifficulty={session.difficulty()}
          onChange={session.handleDifficultyChange}
        />

        <div class="flex items-center gap-6 text-[var(--sub)]">
          <div class="flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="opacity-50"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            <span class="text-[10px] font-bold uppercase tracking-widest">{props.game.defaultLanguage}</span>
          </div>
          <div class="flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="opacity-50"><path d="M6 12h.01M9 9h.01M15 9h.01M18 12h.01M12 15h.01"/><rect width="20" height="12" x="2" y="6" rx="2"/></svg>
            <span class="text-[10px] font-bold uppercase tracking-widest">{props.game.name.toLowerCase()}</span>
          </div>
        </div>
      </div>

      <div class="relative min-h-[60vh] overflow-hidden rounded-2xl bg-[var(--sub-alt)]/10 transition-all hover:bg-[var(--sub-alt)]/20">
        <FallingWordsField
          ref={session.setFieldRef}
          words={session.activeWords()}
          currentInput={session.currentInput()}
          phase={session.phase()}
          score={session.score()}
          onFieldClick={session.focusInput}
        />

        <div class="pointer-events-none relative z-10 flex h-full min-h-[60vh] flex-col items-center justify-between px-10 pt-10 pb-6">
           <div />
           <GameHud
             score={session.score()}
             typedValue={session.currentInput()}
           />
        </div>

        <input
          ref={session.setInputRef}
          value={session.currentInput()}
          class="absolute -left-[9999px] top-0 opacity-0"
          autocapitalize="off"
          autocomplete="off"
          autocorrect="off"
          spellcheck={false}
          onInput={session.handleInput}
          onKeyDown={session.handleKeyDown}
        />
      </div>
    </div>
  )
}

export default TypingSession
