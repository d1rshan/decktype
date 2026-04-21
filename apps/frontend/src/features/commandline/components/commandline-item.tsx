import { Check } from 'lucide-solid'
import { Show } from 'solid-js'

import { themes } from '@/features/content/themes/registry'
import type { ThemeName } from '@/features/content/themes/types'
import { cn } from '@/lib/cn'
import type { CommandlineItem as CommandlineItemType, CommandlineScope } from '@/features/commandline/types'

type CommandlineItemProps = {
  item: CommandlineItemType
  isFocused: boolean
  onPointerMove: (e: PointerEvent) => void
  onClick: () => void
  scope: CommandlineScope
  ref?: (el: HTMLButtonElement) => void
}

function ThemePreview(props: { themeName: ThemeName }) {
  const theme = () => themes[props.themeName]

  return (
    <div
      class="flex items-center gap-1.5 rounded-full px-2 py-1.5 shadow-sm"
      style={{ 'background-color': theme().bg }}
    >
      <div class="h-2.5 w-2.5 rounded-full" style={{ 'background-color': theme().main }} />
      <div class="h-2.5 w-2.5 rounded-full" style={{ 'background-color': theme().sub }} />
      <div class="h-2.5 w-2.5 rounded-full" style={{ 'background-color': theme().text }} />
    </div>
  )
}

function CommandlineItem(props: CommandlineItemProps) {
  const isActive = () => Boolean(props.item.active)

  return (
    <button
      ref={props.ref}
      type="button"
      style={props.isFocused
        ? {
            'background-color': 'var(--text)',
            color: 'var(--sub-alt)',
          }
        : {}}
      class={cn(
        'flex w-full items-center gap-3 px-4 py-1.5 text-left outline-none',
        !props.isFocused && (isActive() ? 'text-(--text)' : 'text-(--sub)'),
      )}
      onPointerMove={props.onPointerMove}
      onClick={props.onClick}
    >
      <div class="flex w-5 shrink-0 justify-center">
        <Show when={isActive()}>
          <Check class={cn('h-4 w-4', props.isFocused ? 'text-(--sub-alt)' : 'text-(--main)')} />
        </Show>
      </div>
      <div class="min-w-0 flex-1">
        <div class="truncate">
          <p class="text-sm leading-normal">{props.item.label}</p>
        </div>
      </div>
      <Show when={props.scope === 'themes'}>
        <ThemePreview themeName={props.item.id.replace('theme-', '') as ThemeName} />
      </Show>
    </button>
  )
}

export default CommandlineItem
