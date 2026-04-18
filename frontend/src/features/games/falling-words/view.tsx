import { Globe, Keyboard } from 'lucide-solid'
import type { GameViewProps } from '@/features/games/types'
import { useCreateResultMutation } from '@/features/results/api'
import { authClient } from '@/lib/auth-client'
import { DifficultySelector } from '../components/difficulty-selector'
import FallingWordsField from './components/falling-words-field'
import GameHud from './components/game-hud'
import { useFallingWordsGame } from './use-falling-words-game'
import { fallingWordsGameMeta } from './meta'
import { difficultyKeys } from './difficulty'

function FallingWordsView(props: GameViewProps) {
  const authSession = authClient.useSession()
  const createResultMutation = useCreateResultMutation()
  const session = useFallingWordsGame(
    props.wordBankId ?? fallingWordsGameMeta.defaultWordBankId,
    {
      onComplete: (result) => {
        if (!authSession().data?.user) {
          return
        }

        createResultMutation.mutate({
          gameId: result.gameId,
          score: result.score,
          difficulty: result.difficulty,
        })
      },
    },
  )

  if (!session.wordBank) {
    return (
      <div class="rounded-[2rem] border border-(--sub-alt) bg-(--sub-alt)/40 p-8 text-(--sub) backdrop-blur-xl">
        Missing word bank for this game.
      </div>
    )
  }

  return (
    <div class="flex flex-col gap-8">
      <div class="flex flex-col items-center gap-6">
        <DifficultySelector
          options={difficultyKeys}
          activeDifficulty={session.difficulty()}
          onChange={session.handleDifficultyChange}
        />

        <div class="flex items-center gap-6 text-(--sub)">
          <div class="flex items-center gap-2">
            <Globe size={14} strokeWidth={2.5} class="opacity-50" />
            <span class="text-xs leading-none font-semibold tracking-widest uppercase">{session.wordBank.label}</span>
          </div>
          <div class="flex items-center gap-2">
            <Keyboard size={14} strokeWidth={2.5} class="opacity-50" />
            <span class="text-xs leading-none font-semibold tracking-widest uppercase">{fallingWordsGameMeta.name.toLowerCase()}</span>
          </div>
        </div>
      </div>

      <div class="relative min-h-[60vh] overflow-hidden rounded-2xl bg-(--sub-alt)/10 transition-all hover:bg-(--sub-alt)/20">
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

export default FallingWordsView
