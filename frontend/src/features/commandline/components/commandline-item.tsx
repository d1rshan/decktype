import { Show } from 'solid-js'

import { themes } from '@/features/content/themes/registry'
import type { ThemeName } from '@/features/content/themes/types'
import { cn } from '@/lib/cn'
import type { CommandlineItem as CommandlineItemType, CommandlineScope } from '@/features/commandline/types'

type CommandlineItemProps = {
  item: CommandlineItemType
  isFocused: boolean
  onMouseEnter: () => void
  onClick: () => void
  scope: CommandlineScope
}

function TickIcon(props: { class?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      class={cn('h-4 w-4', props.class)}
    >
      <path
        fill-rule="evenodd"
        d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 0 1 1.04-.208Z"
        clip-rule="evenodd"
      />
    </svg>
  )
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
      type="button"
      style={props.isFocused
        ? {
            'background-color': 'var(--text)',
            color: 'var(--sub-alt)',
          }
        : {}}
      class={cn(
        'flex w-full items-center gap-3 px-4 py-1.5 text-left transition-colors outline-none',
        !props.isFocused && (isActive() ? 'text-(--text)' : 'text-(--sub)'),
      )}
      onMouseEnter={props.onMouseEnter}
      onClick={props.onClick}
    >
      <div class="flex w-5 shrink-0 justify-center">
        <Show when={isActive()}>
          <TickIcon class={props.isFocused ? 'text-(--sub-alt)' : 'text-(--main)'} />
        </Show>
      </div>
      <div class="min-w-0 flex-1">
        <div class="t-body truncate">{props.item.label}</div>
      </div>
      <Show when={props.scope === 'themes'}>
        <ThemePreview themeName={props.item.id.replace('theme-', '') as ThemeName} />
      </Show>
    </button>
  )
}

export default CommandlineItem
