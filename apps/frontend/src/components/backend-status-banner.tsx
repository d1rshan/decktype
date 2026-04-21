import { Show } from 'solid-js'

import { isBackendDown } from '@/lib/backend-status'

export function BackendStatusBanner() {
  return (
    <Show when={isBackendDown()}>
      <div class="mb-4 rounded-lg border border-(--error)/50 bg-(--error-extra)/45 px-4 py-3">
        <p class="text-sm leading-normal text-(--text)">beta server is currently offline. please try again in a bit.</p>
      </div>
    </Show>
  )
}

export default BackendStatusBanner
