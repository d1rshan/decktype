import { For, type JSX } from 'solid-js'

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
  const minTableWidth = Math.max(props.columns.length * 110, 520)

  return (
    <div class="overflow-x-auto rounded-xl bg-(--sub-alt)">
      <div
        class="grid items-center border-b border-(--sub)/20 px-4 py-3.5"
        style={{ 'grid-template-columns': templateColumns, 'min-width': `${minTableWidth}px` }}
      >
        <For each={props.columns}>
          {(column) => (
            <span class="text-xs leading-none font-semibold tracking-widest text-(--sub) uppercase">{column.label}</span>
          )}
        </For>
      </div>

      <For each={props.rows}>
        {(row, index) => (
          <div
            class="grid items-center gap-2 border-b border-(--sub)/10 px-4 py-3.5 last:border-b-0"
            style={{ 'grid-template-columns': templateColumns, 'min-width': `${minTableWidth}px` }}
          >
            <For each={props.columns}>
              {(column) => (
                <p class="text-base leading-normal">{column.value(row, index())}</p>
              )}
            </For>
          </div>
        )}
      </For>
    </div>
  )
}
