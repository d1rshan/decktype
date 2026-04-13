import { splitProps, type JSX } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import { cn } from '@/lib/cn'

type ButtonProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> &
  JSX.AnchorHTMLAttributes<HTMLAnchorElement> & {
    href?: string
  }

export function Button(props: ButtonProps) {
  const [local, rest] = splitProps(props, ['class', 'children', 'href'])

  return (
    <Dynamic
      component={local.href ? 'a' : 'button'}
      href={local.href}
      {...(rest as any)}
      class={cn(
        'inline-flex items-center justify-center rounded-lg bg-(--sub-alt) px-4 py-3 text-sm font-medium text-(--text) transition-colors hover:bg-(--text) hover:text-(--sub-alt) disabled:opacity-50',
        local.class,
      )}
    >
      {local.children}
    </Dynamic>
  )
}

export default Button
