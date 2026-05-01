import { createSignal } from "solid-js";

import { urls } from "@/lib/urls";

const healthUrl = `${urls.backend}/api/health`;
const POLL_INTERVAL_MS = 20000;

const [isBackendDown, setIsBackendDown] = createSignal(false);

export async function checkBackendHealth() {
  try {
    const response = await fetch(healthUrl, {
      method: "GET",
      credentials: "include",
    });

    setIsBackendDown(!response.ok);
  } catch {
    setIsBackendDown(true);
  }
}

export function startBackendHealthPolling() {
  void checkBackendHealth();

  const interval = window.setInterval(() => {
    void checkBackendHealth();
  }, POLL_INTERVAL_MS);

  return () => {
    window.clearInterval(interval);
  };
}

export { isBackendDown };
