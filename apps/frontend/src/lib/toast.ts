import { createSignal } from "solid-js";

type ToastVariant = "info" | "success" | "error";

type ToastItem = {
  id: number;
  title: string;
  variant: ToastVariant;
};

const TOAST_DURATION_MS = 3200;

let nextToastId = 1;

const [toasts, setToasts] = createSignal<ToastItem[]>([]);

const dismiss = (id: number) => {
  setToasts((current) => current.filter((toast) => toast.id !== id));
};

const show = (variant: ToastVariant, title: string) => {
  const id = nextToastId;
  nextToastId += 1;

  setToasts((current) => [...current, { id, title, variant }]);

  window.setTimeout(() => {
    dismiss(id);
  }, TOAST_DURATION_MS);

  return id;
};

export const toast = {
  info: (title: string) => show("info", title),
  success: (title: string) => show("success", title),
  error: (title: string) => show("error", title),
  dismiss,
};

export const useToasts = () => ({
  toasts,
  dismiss,
});
