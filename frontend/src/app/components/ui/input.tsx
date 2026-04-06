import { splitProps, type JSX } from 'solid-js'

import { cn } from '@/lib/cn'

type InputProps = JSX.InputHTMLAttributes<HTMLInputElement>

function Input(props: InputProps) {
  const [local, rest] = splitProps(props, ['class'])

  return (
    <input
      {...rest}
      class={cn(
        't-input rounded-lg bg-(--sub-alt) px-4 py-3 text-(--text) outline-none placeholder:text-(--sub) focus:bg-[color:color-mix(in_srgb,var(--sub-alt)_80%,var(--bg))]',
        local.class,
      )}
    />
  )
}

export default Input
