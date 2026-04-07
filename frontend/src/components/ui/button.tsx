import { splitProps, type JSX } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import { cn } from '@/lib/cn'

type ButtonSize = 'sm' | 'md' | 'lg' | 'icon'

type ButtonProps = {
  size?: ButtonSize
  as?: keyof JSX.IntrinsicElements | any
  class?: string
  children?: any
  [key: string]: any
}

const sizeClassMap: Record<ButtonSize, string> = {
  sm: 'min-h-9 px-4 text-[0.75rem] leading-none',
  md: 'min-h-11 px-5 text-[0.875rem] leading-none',
  lg: 'min-h-12 px-6 text-[0.95rem] leading-none',
  icon: 'h-11 w-11 p-0',
}

export function Button(props: ButtonProps) {
  const [local, rest] = splitProps(props, ['class', 'size', 'as', 'children'])

  return (
    <Dynamic
      component={local.as ?? 'button'}
      {...rest}
      class={cn(
        'inline-flex cursor-pointer items-center justify-center rounded-lg bg-(--sub-alt) font-medium tracking-[0.08em] text-(--text) transition-[background-color,color,transform,opacity] duration-150 ease-out hover:bg-(--main) hover:text-(--bg) active:translate-y-px disabled:pointer-events-none disabled:bg-(--sub-alt)/55 disabled:text-(--sub)',
        sizeClassMap[local.size ?? 'md'],
        local.class,
      )}
    >
      {local.children}
    </Dynamic>
  )
}

export default Button
