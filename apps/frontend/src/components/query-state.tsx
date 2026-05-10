import { Match, Show, Switch, type JSX } from "solid-js";
import { Spinner } from "@/components/ui/spinner";
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
  loadingFallback?: JSX.Element;
  errorFallback?: JSX.Element | ((error: unknown) => JSX.Element);
}

export function QueryState<T>(props: QueryStateProps<T>) {
  return (
    <Switch>
      <Match when={props.query.isPending}>
        <Show
          when={props.loadingFallback}
          fallback={
            <div class="flex min-h-32 items-center justify-center">
              <Spinner />
            </div>
          }
        >
          {props.loadingFallback}
        </Show>
      </Match>

      <Match when={props.query.isError}>
        <Show
          when={props.errorFallback}
          fallback={
            <div class="rounded-lg bg-(--sub-alt) p-4 text-(--error)">
              <p class="text-base">{getErrorMessage(props.query.error)}</p>
            </div>
          }
        >
          {typeof props.errorFallback === "function"
            ? props.errorFallback(props.query.error)
            : props.errorFallback}
        </Show>
      </Match>

      <Match when={props.query.data !== undefined}>
        <Show when={props.query.data} keyed>
          {(content) => {
            const isEmpty =
              (Array.isArray(content) && content.length === 0) ||
              (typeof content === "object" &&
                content !== null &&
                Object.keys(content).length === 0);

            if (isEmpty && props.emptyMessage) {
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
