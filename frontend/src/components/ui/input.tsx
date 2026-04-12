import { splitProps, type JSX } from 'solid-js'
import { cn } from '@/lib/cn'

type InputProps = JSX.InputHTMLAttributes<HTMLInputElement> & {
  error?: boolean
}

export function Input(props: InputProps) {
  const [local, rest] = splitProps(props, ['class', 'error'])

  return (
    <input
      {...rest}
      class={cn(
        'w-full rounded-lg bg-(--sub-alt) px-4 py-3 text-[1rem] leading-[1.4] text-(--text) outline-none transition placeholder:text-(--sub)/60 focus:bg-(--sub-alt)/60 focus:ring-1 focus:ring-(--main)/30',
        local.error && 'border border-(--error) focus:ring-(--error)/30',
        local.class,
      )}
    />
  )
}

export default Input
