import { createEffect, createMemo, createSignal, onCleanup, onMount, Show } from 'solid-js'
import { Command } from 'lucide-solid'

import CommandlineInput from '@/features/commandline/components/commandline-input'
import CommandlineList from '@/features/commandline/components/commandline-list'
import { createCommandlineRegistry } from '@/features/commandline/registry'
import type { CommandlineItem, CommandlineScope } from '@/features/commandline/types'
import { filterCommands, getScopeLabel } from '@/features/commandline/utils'
import { themeManager } from '@/features/content/themes/manager'

function Commandline() {
  let searchInputRef: HTMLInputElement | undefined
  const [isOpen, setIsOpen] = createSignal(false)
  const [query, setQuery] = createSignal('')
  const [selectedIndex, setSelectedIndex] = createSignal(0)
  const [scope, setScope] = createSignal<CommandlineScope>('root')
  const [interactionType, setInteractionType] = createSignal<'keyboard' | 'mouse'>('keyboard')

  const registry = createMemo(() =>
    createCommandlineRegistry(setScope),
  )

  const itemsForScope = createMemo(() => registry()[scope()])

  const visibleItems = createMemo(() =>
    filterCommands(itemsForScope(), query()),
  )

  const isNestedScope = createMemo(() => scope() !== 'root')
  const inputPlaceholder = createMemo(() =>
    isNestedScope()
      ? `${getScopeLabel(scope() as Exclude<CommandlineScope, 'root'>).toLowerCase()}...`
      : 'Search...',
  )

  const focusInput = () => {
    queueMicrotask(() => searchInputRef?.focus())
  }

  const resetInteractionState = () => {
    setQuery('')
    setSelectedIndex(0)
  }

  const stepBack = () => {
    if (query()) {
      resetInteractionState()
      return
    }

    if (isNestedScope()) {
      setScope('root')
      setSelectedIndex(0)
      return
    }

    setIsOpen(false)
  }

  const handleSelectItem = (item: CommandlineItem) => {
    const previousScope = scope()
    item.onSelect()

    if (previousScope === scope()) {
      setIsOpen(false)
      return
    }

    resetInteractionState()
    focusInput()
  }

  createEffect(() => {
    if (scope() === 'themes' && isOpen()) {
      const item = visibleItems()[selectedIndex()]

      if (item && item.id.startsWith('theme-')) {
        themeManager.preview(item.id.replace('theme-', '') as any)
      }

      return
    }

    if (isOpen()) {
      themeManager.reset()
    }
  })

  createEffect(() => {
    if (!isOpen()) {
      resetInteractionState()
      setScope('root')
      themeManager.reset()
      return
    }

    resetInteractionState()
    setScope('root')
    focusInput()
  })

  createEffect(() => {
    const maxIndex = visibleItems().length - 1

    if (selectedIndex() > maxIndex) {
      setSelectedIndex(Math.max(maxIndex, 0))
    }
  })

  onMount(() => {
    const handleCommandlineShortcut = (event: KeyboardEvent) => {
      if (!(event.ctrlKey || event.metaKey) || event.key.toLowerCase() !== 'k') {
        return
      }

      event.preventDefault()
      setIsOpen((current) => !current)
    }

    window.addEventListener('keydown', handleCommandlineShortcut)

    onCleanup(() => {
      window.removeEventListener('keydown', handleCommandlineShortcut)
    })
  })

  createEffect(() => {
    if (!isOpen()) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        stepBack()
        return
      }

      if (event.key === 'Backspace' && query() === '' && isNestedScope()) {
        event.preventDefault()
        stepBack()
        return
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault()
        setInteractionType('keyboard')
        setSelectedIndex((current) => {
          if (visibleItems().length === 0) {
            return 0
          }

          return (current + 1) % visibleItems().length
        })
        return
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault()
        setInteractionType('keyboard')
        setSelectedIndex((current) => {
          if (visibleItems().length === 0) {
            return 0
          }

          return (current - 1 + visibleItems().length) % visibleItems().length
        })
        return
      }

      if (event.key === 'Enter') {
        event.preventDefault()
        const item = visibleItems()[selectedIndex()]

        if (!item) {
          return
        }

        handleSelectItem(item)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    onCleanup(() => {
      window.removeEventListener('keydown', handleKeyDown)
    })
  })

  return (
    <>
      <Show when={!isOpen()}>
        <button
          type="button"
          class="fixed right-5 bottom-5 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-(--main) text-(--bg) shadow-lg transition hover:opacity-90 sm:hidden"
          onClick={() => setIsOpen(true)}
          aria-label="Open command line"
        >
          <Command size={20} strokeWidth={2.4} />
        </button>
      </Show>

      <Show when={isOpen()}>
        <div
          class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-(--bg)/90 px-5"
          onClick={() => setIsOpen(false)}
        >
          <div class="w-full max-w-[450px]">
            <div
              class="overflow-hidden rounded-lg bg-(--sub-alt)"
              onClick={(event) => event.stopPropagation()}
            >
              <CommandlineInput
                inputRef={(element) => {
                  searchInputRef = element
                }}
                value={query()}
                placeholder={inputPlaceholder()}
                onInput={(value) => {
                  setQuery(value)
                  setSelectedIndex(0)
                }}
              />

              <CommandlineList
                items={visibleItems()}
                selectedIndex={selectedIndex()}
                scope={scope()}
                interactionType={interactionType()}
                onHoverItem={(index) => {
                  setSelectedIndex(index)
                  setInteractionType('mouse')
                }}
                onSelectItem={handleSelectItem}
              />
            </div>
          </div>
        </div>
      </Show>
    </>
  )
}

export default Commandline
