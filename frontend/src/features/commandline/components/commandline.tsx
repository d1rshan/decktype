import { createEffect, createMemo, createSignal, onCleanup, Show } from 'solid-js'

import CommandlineInput from '@/features/commandline/components/commandline-input'
import CommandlineList from '@/features/commandline/components/commandline-list'
import { createCommandlineRegistry } from '@/features/commandline/registry'
import type { CommandlineItem, CommandlineProps, CommandlineScope } from '@/features/commandline/types'
import { filterCommands, getScopeLabel } from '@/features/commandline/utils'

function Commandline(props: CommandlineProps) {
  let searchInputRef: HTMLInputElement | undefined
  const [query, setQuery] = createSignal('')
  const [selectedIndex, setSelectedIndex] = createSignal(0)
  const [scope, setScope] = createSignal<CommandlineScope>('root')

  const registry = createMemo(() =>
    createCommandlineRegistry(props, setScope),
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

    props.onClose()
  }

  const handleSelectItem = (item: CommandlineItem) => {
    const previousScope = scope()
    item.onSelect()

    if (previousScope === scope()) {
      props.onClose()
      return
    }

    resetInteractionState()
    focusInput()
  }

  createEffect(() => {
    if (scope() === 'themes' && props.isOpen) {
      const item = visibleItems()[selectedIndex()]

      if (item && item.id.startsWith('theme-')) {
        props.onPreviewTheme(item.id.replace('theme-', '') as CommandlineProps['currentThemeName'])
      }

      return
    }

    if (props.isOpen) {
      props.onPreviewTheme(props.currentThemeName)
    }
  })

  createEffect(() => {
    if (!props.isOpen) {
      resetInteractionState()
      setScope('root')
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

  createEffect(() => {
    if (!props.isOpen) {
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
    <Show when={props.isOpen}>
      <div
        class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-(--bg)/90 px-5"
        onClick={props.onClose}
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
              onHoverItem={setSelectedIndex}
              onSelectItem={handleSelectItem}
            />
          </div>
        </div>
      </div>
    </Show>
  )
}

export default Commandline
