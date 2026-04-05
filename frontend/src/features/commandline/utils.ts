import type { CommandlineItem, CommandlineScope } from '@/features/commandline/types'

export function filterCommands(items: CommandlineItem[], query: string) {
  const normalizedQuery = query.trim().toLowerCase()

  if (!normalizedQuery) {
    return items
  }

  return items.filter((item) =>
    [item.label, ...item.keywords]
      .join(' ')
      .toLowerCase()
      .includes(normalizedQuery),
  )
}

export function getScopeLabel(scope: Exclude<CommandlineScope, 'root'>) {
  if (scope === 'navigate') {
    return 'Navigate'
  }

  if (scope === 'games') {
    return 'Games'
  }

  if (scope === 'themes') {
    return 'Themes'
  }

  return 'Word Banks'
}
