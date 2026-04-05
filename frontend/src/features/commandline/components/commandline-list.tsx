import { For, Show } from 'solid-js'

import type { CommandlineItem as CommandlineItemType, CommandlineScope } from '@/features/commandline/types'
import CommandlineItem from '@/features/commandline/components/commandline-item'

type CommandlineListProps = {
  items: CommandlineItemType[]
  selectedIndex: number
  scope: CommandlineScope
  onHoverItem: (index: number) => void
  onSelectItem: (item: CommandlineItemType) => void
}

function CommandlineList(props: CommandlineListProps) {
  return (
    <div class="max-h-[50vh] overflow-y-auto">
      <Show
        when={props.items.length > 0}
        fallback={(
          <div class="px-4 py-6 text-center text-[var(--sub)]">
            no results...
          </div>
        )}
      >
        <div class="flex flex-col">
          <For each={props.items}>
            {(item, index) => (
              <CommandlineItem
                item={item}
                isFocused={index() === props.selectedIndex}
                scope={props.scope}
                onMouseEnter={() => props.onHoverItem(index())}
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
