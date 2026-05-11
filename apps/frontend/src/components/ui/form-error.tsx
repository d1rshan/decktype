import { Show } from "solid-js";

interface FormErrorProps {
  message: string | null | undefined;
  class?: string;
}

export function FormError(props: FormErrorProps) {
  return (
    <Show when={props.message}>
      {(message) => (
        <p class={`mt-1 text-sm text-(--error) ${props.class ?? ""}`}>
          {message()}
        </p>
      )}
    </Show>
  );
}

export default FormError;
