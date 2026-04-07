import { splitProps, type JSX } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import { cn } from '@/lib/cn'

type TextVariant =
  | 'label'
  | 'caption'
  | 'body'
  | 'title'
  | 'metric'
  | 'display'

type TextTone = 'default' | 'sub' | 'main' | 'error' | 'success'

type TextProps = {
  variant?: TextVariant
  tone?: TextTone
  upper?: boolean
  class?: string
  children?: any
}

const variantElementMap: Record<TextVariant, keyof JSX.IntrinsicElements> = {
  label: 'span',
  caption: 'span',
  body: 'p',
  title: 'h2',
  metric: 'div',
  display: 'div',
}

const variantClassMap: Record<TextVariant, string> = {
  label: 'text-[0.6875rem] leading-[1.1] font-semibold tracking-[0.16em]',
  caption: 'text-[0.75rem] leading-[1.25]',
  body: 'text-[0.95rem] leading-[1.4]',
  title: 'text-[1.5rem] leading-[1.2] font-bold',
  metric: 'text-[2.125rem] leading-none font-bold sm:text-[2.25rem]',
  display: 'text-[4rem] leading-none font-bold sm:text-[6rem]',
}

const toneClassMap: Record<TextTone, string> = {
  default: '',
  sub: 'text-(--sub)',
  main: 'text-(--main)',
  error: 'text-(--error)',
  success: 'text-(--success)',
}

export function Text(props: TextProps) {
  const [local, rest] = splitProps(props, [
    'variant',
    'tone',
    'upper',
    'class',
    'children',
  ])

  const variant = local.variant ?? 'body'
  const tone = local.tone ?? 'default'

  return (
    <Dynamic
      component={variantElementMap[variant]}
      {...rest}
      class={cn(
        variantClassMap[variant],
        toneClassMap[tone],
        local.upper && 'uppercase',
        local.class,
      )}
    >
      {local.children}
    </Dynamic>
  )
}
