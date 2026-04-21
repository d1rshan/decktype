import { splitProps, type JSX } from 'solid-js'
import { cn } from '@/lib/cn'

export type KbdProps = JSX.HTMLAttributes<HTMLElement>

export function Kbd(props: KbdProps) {
  const [local, rest] = splitProps(props, ['class', 'children'])

  return (
    <kbd
      {...rest}
      class={cn(
        'rounded bg-(--sub-alt) px-2 py-1 text-xs leading-tight font-mono text-(--sub)',
        local.class,
      )}
    >
      {local.children}
    </kbd>
  )
}

export default Kbd
