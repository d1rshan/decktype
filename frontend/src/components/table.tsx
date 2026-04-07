import { For, type JSX } from 'solid-js'

import { Text } from '@/components/ui/text'

type TableCellValue = JSX.Element | string | number

export type TableColumn<T> = {
  id: string
  label: string
  value: (row: T, index: number) => TableCellValue
}

type TableProps<T> = {
  columns: readonly TableColumn<T>[]
  rows: readonly T[]
}

export function Table<T>(props: TableProps<T>) {
  const templateColumns = `repeat(${props.columns.length}, minmax(0, 1fr))`

  return (
    <div class="overflow-hidden rounded-xl bg-(--sub-alt)">
      <div
        class="hidden border-b border-(--sub)/20 px-4 py-3.5 sm:grid sm:items-center"
        style={{ 'grid-template-columns': templateColumns }}
      >
        <For each={props.columns}>
          {(column) => (
            <Text variant="label" tone='sub' upper>{column.label}</Text>
          )}
        </For>
      </div>

      <For each={props.rows}>
        {(row, index) => (
          <div
            class="grid gap-2 border-b border-(--sub)/10 px-4 py-3.5 last:border-b-0 sm:grid sm:items-center"
            style={{ 'grid-template-columns': templateColumns }}
          >
            <For each={props.columns}>
              {(column) => (
                <Text variant="body">{column.value(row, index())}</Text>
              )}
            </For>
          </div>
        )}
      </For>
    </div>
  )
}
