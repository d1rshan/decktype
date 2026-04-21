import { Kbd } from '@/components/ui/kbd'

export function Footer() {
  return (
    <footer class="flex h-12 w-full items-center justify-between text-(--sub) sm:grid sm:grid-cols-[1fr_auto_1fr]">
      <div class="flex items-center gap-6">
        <a href="https://github.com/d1rshan/decktype" target="_blank" rel="noreferrer" class="hover:text-(--text)"><span class="text-xs leading-tight">github</span></a>
      </div>

      <div class="hidden items-center justify-center gap-2 sm:flex">
        <div class="flex items-center gap-1">
          <Kbd>ctrl</Kbd>
          <span class="text-xs">/</span>
          <Kbd>cmd</Kbd>
          <span class="text-xs">+</span>
          <Kbd>k</Kbd>
        </div>
        <span class="text-xs">-</span>
        <span class="text-xs leading-tight">command line</span>
      </div>

      <div class="flex justify-end">
        <span class="text-xs leading-tight">v1.0.0</span>
      </div>
    </footer>
  )
}
