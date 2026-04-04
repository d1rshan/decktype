import { createEffect, createMemo, createSignal, onCleanup, onMount } from 'solid-js'
import { getWordBank } from '../../word-banks/get-word-bank'
import type { WordBankId } from '../../word-banks/types'
import { getDifficulty } from './difficulty'
import { createFallingWord } from './engine'
import type { DifficultyKey, FallingWord, GamePhase } from './types'

function formatScore(elapsedMs: number) {
  return Math.floor(elapsedMs / 1000)
}

function findExactMatch(words: FallingWord[], value: string) {
  return words
    .filter((word) => word.text === value)
    .sort((left, right) => right.y - left.y)[0]
}

export function useFallingWordsGame(wordBankId: WordBankId) {
  const wordBank = getWordBank(wordBankId)

  let inputRef: HTMLInputElement | undefined
  let fieldRef: HTMLDivElement | undefined
  let animationFrame = 0
  let nextWordId = 1
  let lastFrameTime = 0
  let lastSpawnTime = 0
  let runStartTime = 0

  const [phase, setPhase] = createSignal<GamePhase>('idle')
  const [difficulty, setDifficulty] = createSignal<DifficultyKey>('easy')
  const [fieldWidth, setFieldWidth] = createSignal(0)
  const [fieldHeight, setFieldHeight] = createSignal(0)
  const [activeWords, setActiveWords] = createSignal<FallingWord[]>([])
  const [currentInput, setCurrentInput] = createSignal('')
  const [elapsedMs, setElapsedMs] = createSignal(0)
  const [isTabPressed, setIsTabPressed] = createSignal(false)

  const selectedDifficulty = createMemo(() => getDifficulty(difficulty()))
  const score = createMemo(() => formatScore(elapsedMs()))

  const stopLoop = () => {
    if (animationFrame) {
      window.cancelAnimationFrame(animationFrame)
      animationFrame = 0
    }
  }

  const updateFieldSize = () => {
    if (fieldRef) {
      const rect = fieldRef.getBoundingClientRect()
      setFieldWidth(rect.width)
      setFieldHeight(rect.height)
    }
  }

  const focusInput = () => {
    inputRef?.focus()
  }

  const spawnWord = () => {
    if (!wordBank || wordBank.words.length === 0) {
      return
    }

    const nextWord = createFallingWord(
      nextWordId,
      fieldWidth(),
      wordBank.words,
      selectedDifficulty(),
    )
    nextWordId += 1
    setActiveWords((current) => [...current, nextWord])
  }

  const resetGame = (nextDifficulty = difficulty()) => {
    stopLoop()
    setDifficulty(nextDifficulty)
    setPhase('idle')
    setActiveWords([])
    setCurrentInput('')
    if (inputRef) {
      inputRef.value = ''
    }
    focusInput()
    setElapsedMs(0)
    lastFrameTime = 0
    lastSpawnTime = 0
    runStartTime = 0
    setIsTabPressed(false)
  }

  const startGame = () => {
    updateFieldSize()
    resetGame(difficulty())
    setPhase('running')
    runStartTime = performance.now()
    lastFrameTime = runStartTime
    lastSpawnTime = runStartTime
    spawnWord()
  }

  const endGame = () => {
    setPhase('game-over')
    stopLoop()
  }

  const submitExactMatch = (value: string) => {
    const targetWord = findExactMatch(activeWords(), value)
    if (!targetWord) {
      return false
    }

    setActiveWords((current) => current.filter((word) => word.id !== targetWord.id))
    setCurrentInput('')
    if (inputRef) {
      inputRef.value = ''
    }
    return true
  }

  const handleDifficultyChange = (nextDifficulty: DifficultyKey) => {
    if (phase() === 'running') {
      resetGame(nextDifficulty)
      return
    }

    setDifficulty(nextDifficulty)
  }

  const handleInput = (event: InputEvent & { currentTarget: HTMLInputElement }) => {
    const sanitized = event.currentTarget.value.replace(/\s+/g, '')

    if (phase() === 'idle' && sanitized.length > 0) {
      startGame()
      setCurrentInput(sanitized)
      submitExactMatch(sanitized)
      return
    }

    if (phase() !== 'running') {
      event.currentTarget.value = ''
      return
    }

    setCurrentInput(sanitized)
    submitExactMatch(sanitized)
  }

  const handleKeyDown = (
    event: KeyboardEvent & { currentTarget: HTMLInputElement },
  ) => {
    if (event.key === 'Tab') {
      event.preventDefault()
      setIsTabPressed(true)
      return
    }

    if (event.key === 'Enter') {
      if (isTabPressed()) {
        event.preventDefault()
        resetGame()
        return
      }

      if (phase() === 'idle' || phase() === 'game-over') {
        event.preventDefault()
        startGame()
        return
      }

      event.preventDefault()
      submitExactMatch(currentInput())
    }

    if (event.key === 'Escape') {
      event.preventDefault()
      resetGame()
      return
    }

    if (event.key === ' ') {
      event.preventDefault()
      submitExactMatch(currentInput())
    }
  }

  const handleKeyUp = (event: KeyboardEvent) => {
    if (event.key === 'Tab') {
      setIsTabPressed(false)
    }
  }

  createEffect(() => {
    if (phase() !== 'running') {
      stopLoop()
      return
    }

    const tick = (timestamp: number) => {
      const deltaSeconds = Math.min((timestamp - lastFrameTime) / 1000, 0.032)
      lastFrameTime = timestamp
      setElapsedMs(timestamp - runStartTime)

      const difficultyConfig = selectedDifficulty()

      if (timestamp - lastSpawnTime >= difficultyConfig.spawnIntervalMs) {
        spawnWord()
        lastSpawnTime = timestamp
      }

      let hitBottom = false

      setActiveWords((current) =>
        current.map((word) => {
          const nextVelocityY = word.velocityY + difficultyConfig.gravity * deltaSeconds
          const nextX = word.x + word.velocityX * deltaSeconds
          const maxX = Math.max(fieldWidth() - word.text.length * 18 - 36, 24)
          const bouncedX =
            nextX <= 20 || nextX >= maxX ? word.velocityX * -1 : word.velocityX
          const clampedX = Math.min(Math.max(nextX, 20), maxX)
          const nextY = word.y + nextVelocityY * deltaSeconds
          const nextRotation = word.rotation + word.angularVelocity * deltaSeconds

          if (fieldHeight() > 0 && nextY >= fieldHeight() - 40 && word.y < fieldHeight()) {
            hitBottom = true
          }

          return {
            ...word,
            x: clampedX,
            y: nextY,
            velocityX: bouncedX,
            velocityY: nextVelocityY,
            rotation: nextRotation,
          }
        }),
      )

      if (hitBottom) {
        endGame()
        return
      }

      animationFrame = window.requestAnimationFrame(tick)
    }

    animationFrame = window.requestAnimationFrame((timestamp) => {
      lastFrameTime = timestamp
      tick(timestamp)
    })

    onCleanup(stopLoop)
  })

  onMount(() => {
    updateFieldSize()
    setTimeout(updateFieldSize, 100)
    focusInput()

    const observer = new ResizeObserver(() => {
      updateFieldSize()
    })

    if (fieldRef) {
      observer.observe(fieldRef)
    }

    window.addEventListener('keyup', handleKeyUp)

    onCleanup(() => {
      observer.disconnect()
      window.removeEventListener('keyup', handleKeyUp)
    })
  })

  onCleanup(() => {
    stopLoop()
  })

  return {
    activeWords,
    currentInput,
    difficulty,
    handleDifficultyChange,
    handleInput,
    handleKeyDown,
    phase,
    score,
    setInputRef: (element: HTMLInputElement) => {
      inputRef = element
    },
    setFieldRef: (element: HTMLDivElement) => {
      fieldRef = element
    },
    focusInput,
    wordBank,
  }
}
