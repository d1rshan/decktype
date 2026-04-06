import { For } from 'solid-js'

import { useToasts } from '@/lib/toast'

const variantUi = {
  info: {
    label: 'Notice',
    frameClass:
      'border-[#2ad14a]/85 bg-[#0d5e1b]/68 text-[#dcffe3] shadow-[0_4px_10px_rgba(7,73,19,0.16)]',
    titleClass: 'text-[#8ff2a2]',
  },
  success: {
    label: 'Success',
    frameClass:
      'border-[#2ad14a]/85 bg-[#0d5e1b]/68 text-[#dcffe3] shadow-[0_4px_10px_rgba(7,73,19,0.16)]',
    titleClass: 'text-[#8ff2a2]',
  },
  error: {
    label: 'Error',
    frameClass:
      'border-[#ff3c3c]/90 bg-[#8e1114]/68 text-[#ffe3e3] shadow-[0_4px_10px_rgba(90,8,10,0.16)]',
    titleClass: 'text-[#ffb2b2]',
  },
} as const

function ToastRegion() {
  const { toasts } = useToasts()

  return (
    <div class="toast-region pointer-events-none fixed top-24 right-4 z-40 flex w-[min(22rem,calc(100vw-1rem))] flex-col gap-2 sm:right-6">
      <For each={toasts()}>
        {(item) => (
          <div
            class={`toast-enter pointer-events-auto rounded-xl border px-3 py-2.5 backdrop-blur-sm ${variantUi[item.variant].frameClass}`}
          >
            <div class="min-w-0">
              <div class={`t-body leading-none font-semibold ${variantUi[item.variant].titleClass}`}>
                  {variantUi[item.variant].label}
              </div>
              <div class="t-body mt-1 leading-5 font-medium">
                {item.title}
              </div>
            </div>
          </div>
        )}
      </For>
    </div>
  )
}

export default ToastRegion
