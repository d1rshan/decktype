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
    <div class="toast-region pointer-events-none fixed inset-x-0 top-24 z-40 mx-auto w-full max-w-[1320px] px-5 sm:px-8 lg:px-10 xl:px-12">
      <div class="ml-auto flex w-[min(20rem,100%)] flex-col gap-1.5">
        <For each={toasts()}>
          {(item) => (
            <div
              class={`toast-enter pointer-events-auto rounded-lg border px-2.5 py-2 backdrop-blur-sm ${variantUi[item.variant].frameClass}`}
            >
              <div class="min-w-0">
                <div class={variantUi[item.variant].titleClass}>
                  <p class="text-sm leading-snug">{variantUi[item.variant].label}</p>
                </div>
                <div class="mt-0.5 flex-1">
                  <p class="text-sm leading-snug">{item.title}</p>
                </div>
              </div>
            </div>
          )}
        </For>
      </div>
    </div>
  )
}

export default ToastRegion
