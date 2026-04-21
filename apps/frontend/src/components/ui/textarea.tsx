import { splitProps, type JSX } from 'solid-js'
import { cn } from '@/lib/cn'

type TextareaProps = JSX.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  error?: boolean
}

export function Textarea(props: TextareaProps) {
  const [local, rest] = splitProps(props, ['class', 'error'])

  return (
    <textarea
      {...rest}
      class={cn(
        'w-full min-h-[120px] rounded-lg bg-(--sub-alt) px-4 py-3 text-base leading-relaxed text-(--text) outline-none transition placeholder:text-(--sub)/60 focus:bg-(--sub-alt)/60 focus:ring-1 focus:ring-(--main)/30 resize-none',
        local.error && 'border border-(--error) focus:ring-(--error)/30',
        local.class,
      )}
    />
  )
}

export default Textarea
