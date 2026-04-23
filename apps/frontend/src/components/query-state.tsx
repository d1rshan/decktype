import { Match, Show, Switch, type JSX } from "solid-js";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { getErrorMessage } from "@/lib/api-client";

interface QueryStateProps<T> {
  query: {
    isPending: boolean;
    isError: boolean;
    error: any;
    data: T | undefined;
  };
  children: (data: T) => JSX.Element;
  emptyMessage?: string;
}

export function QueryState<T>(props: QueryStateProps<T>) {
  return (
    <Switch>
      <Match when={props.query.isPending}>
        <div class="flex min-h-32 items-center justify-center">
          <LoadingSpinner />
        </div>
      </Match>

      <Match when={props.query.isError}>
        <div class="rounded-lg bg-(--sub-alt) p-4 text-(--error)">
          <p class="text-base">{getErrorMessage(props.query.error)}</p>
        </div>
      </Match>

      <Match when={props.query.data !== undefined}>
        <Show when={props.query.data} keyed>
          {(content) => {
            const isEmptyArray =
              Array.isArray(content) && (content as unknown[]).length === 0;

            if (isEmptyArray && props.emptyMessage) {
              return (
                <div class="rounded-lg bg-(--sub-alt) p-4">
                  <p class="text-base opacity-50">{props.emptyMessage}</p>
                </div>
              );
            }

            return props.children(content);
          }}
        </Show>
      </Match>
    </Switch>
  );
}
