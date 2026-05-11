import { createStore } from "solid-js/store";
import { createSignal, Show } from "solid-js";
import type { ZodSchema } from "zod";
import { cn } from "./cn";

export function createFormState<T extends Record<string, string>>(initial: T) {
  const [fields, setFields] = createStore<T>(initial);
  const [error, setError] = createSignal<string | null>(null);
  const [submitting, setSubmitting] = createSignal(false);

  const setField =
    (key: keyof T) =>
    (
      e: InputEvent & { currentTarget: HTMLInputElement | HTMLTextAreaElement },
    ) => {
      // @ts-expect-error type variance in solid store
      setFields(key, e.currentTarget.value);
      setError(null);
    };

  const validate = (schema: ZodSchema) => {
    const parsed = schema.safeParse(fields);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Validation failed");
      return null;
    }
    return parsed.data as T;
  };

  const FormError = (props: { class?: string }) => (
    <Show when={error()}>
      {(message) => (
        <p class={cn("mt-1 text-sm text-(--error)", props.class)}>
          {message()}
        </p>
      )}
    </Show>
  );

  return {
    fields,
    setFields,
    setField,
    error,
    setError,
    submitting,
    setSubmitting,
    validate,
    FormError,
  };
}
