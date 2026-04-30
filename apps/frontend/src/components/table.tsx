import { For, type JSX } from "solid-js";

type TableCellValue = JSX.Element | string | number;

export type TableColumn<T> = {
  id: string;
  label: string;
  mobileLabel?: string;
  align?: "left" | "center" | "right";
  value: (row: T, index: number) => TableCellValue;
  mobileValue?: (row: T, index: number) => TableCellValue;
};

type TableProps<T> = {
  columns: readonly TableColumn<T>[];
  rows: readonly T[];
  templateColumns?: string;
  minTableWidth?: number;
  mobileTemplateColumns?: string;
};

export function Table<T>(props: TableProps<T>) {
  const templateColumns =
    props.templateColumns ?? `repeat(${props.columns.length}, minmax(0, 1fr))`;
  const minTableWidth =
    props.minTableWidth ?? Math.max(props.columns.length * 110, 520);
  const mobileTemplateColumns =
    props.mobileTemplateColumns ??
    `repeat(${props.columns.length}, minmax(0, 1fr))`;

  const getAlignClass = (align: TableColumn<T>["align"]) => {
    if (align === "center") {
      return "text-center";
    }

    if (align === "right") {
      return "text-right";
    }

    return "text-left";
  };

  return (
    <>
      <div class="hidden overflow-x-auto rounded-xl bg-(--sub-alt) sm:block">
        <div
          class="grid items-center gap-2 border-b border-(--sub)/20 px-4 py-3.5"
          style={{
            "grid-template-columns": templateColumns,
            "min-width": `${minTableWidth}px`,
          }}
        >
          <For each={props.columns}>
            {(column) => (
              <span
                class={`min-w-0 truncate text-xs leading-none font-semibold tracking-widest text-(--sub) uppercase ${getAlignClass(
                  column.align,
                )}`}
              >
                {column.label}
              </span>
            )}
          </For>
        </div>

        <For each={props.rows}>
          {(row, index) => (
            <div
              class="grid items-start gap-2 border-b border-(--sub)/10 px-4 py-3.5 last:border-b-0"
              style={{
                "grid-template-columns": templateColumns,
                "min-width": `${minTableWidth}px`,
              }}
            >
              <For each={props.columns}>
                {(column) => (
                  <p
                    class={`min-w-0 text-base leading-snug ${
                      column.id === "date" ? "" : "truncate"
                    } ${getAlignClass(column.align)}`}
                  >
                    {column.value(row, index())}
                  </p>
                )}
              </For>
            </div>
          )}
        </For>
      </div>

      <div class="overflow-hidden rounded-xl bg-(--sub-alt) sm:hidden">
        <div
          class="grid items-center gap-1 border-b border-(--sub)/20 px-2 py-3"
          style={{ "grid-template-columns": mobileTemplateColumns }}
        >
          <For each={props.columns}>
            {(column) => (
              <span
                class={`min-w-0 whitespace-nowrap text-[0.48rem] leading-none font-semibold tracking-wider text-(--sub) uppercase ${getAlignClass(
                  column.align,
                )}`}
              >
                {column.mobileLabel ?? column.label}
              </span>
            )}
          </For>
        </div>

        <For each={props.rows}>
          {(row, index) => (
            <div
              class="grid items-start gap-1 border-b border-(--sub)/10 px-2 py-3 last:border-b-0"
              style={{ "grid-template-columns": mobileTemplateColumns }}
            >
              <For each={props.columns}>
                {(column) => (
                  <p
                    class={`min-w-0 whitespace-nowrap leading-[1.25] ${
                      column.id === "player"
                        ? "truncate text-[0.6rem]"
                        : column.id === "date"
                          ? "text-[0.58rem]"
                          : "text-[0.62rem]"
                    } ${getAlignClass(column.align)}`}
                  >
                    {(column.mobileValue ?? column.value)(row, index())}
                  </p>
                )}
              </For>
            </div>
          )}
        </For>
      </div>
    </>
  );
}
