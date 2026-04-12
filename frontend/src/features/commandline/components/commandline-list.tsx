import { createEffect, For, Show } from 'solid-js'

import type { CommandlineItem as CommandlineItemType, CommandlineScope } from '@/features/commandline/types'
import CommandlineItem from '@/features/commandline/components/commandline-item'

type CommandlineListProps = {
  items: CommandlineItemType[]
  selectedIndex: number
  scope: CommandlineScope
  interactionType: 'keyboard' | 'mouse'
  onHoverItem: (index: number) => void
  onSelectItem: (item: CommandlineItemType) => void
}

function CommandlineList(props: CommandlineListProps) {
  let listRef: HTMLDivElement | undefined
  const itemRefs: HTMLButtonElement[] = []
  let lastMouseY = -1

  const handlePointerMove = (index: number, event: PointerEvent) => {
    if (event.clientY === lastMouseY) {
      return
    }
    lastMouseY = event.clientY
    props.onHoverItem(index)
  }

  createEffect((prevIndex: number) => {
    const currentIndex = props.selectedIndex

    if (props.interactionType === 'keyboard' && listRef && itemRefs[currentIndex]) {
      const buffer = 3
      const isMovingDown = currentIndex > prevIndex
      let targetIndex = currentIndex

      if (isMovingDown) {
        targetIndex = Math.min(currentIndex + buffer, props.items.length - 1)
      } else {
        targetIndex = Math.max(currentIndex - buffer, 0)
      }

      const targetElement = itemRefs[targetIndex]
      if (targetElement) {
        targetElement.scrollIntoView({ block: 'nearest' })
      }
    }

    return currentIndex
  }, props.selectedIndex)

  return (
    <div ref={listRef} class="max-h-[50vh] overflow-y-auto">
      <Show
        when={props.items.length > 0}
        fallback={(
          <div class="px-4 py-6 text-center text-(--sub)">
            no results...
          </div>
        )}
      >
        <div class="flex flex-col">
          <For each={props.items}>
            {(item, index) => (
              <CommandlineItem
                ref={(el) => (itemRefs[index()] = el)}
                item={item}
                isFocused={index() === props.selectedIndex}
                scope={props.scope}
                onPointerMove={(e) => handlePointerMove(index(), e)}
                onClick={() => props.onSelectItem(item)}
              />
            )}
          </For>
        </div>
      </Show>
    </div>
  )
}

export default CommandlineList
