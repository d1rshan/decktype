import { splitProps, type JSX } from 'solid-js'

import { cn } from '@/lib/cn'

type ButtonVariant = 'solid' | 'outline' | 'ghost'
type ButtonSize = 'md' | 'lg'

type ButtonProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
}

const variantClassMap: Record<ButtonVariant, string> = {
  solid:
    'bg-[color:color-mix(in_srgb,var(--sub-alt)_90%,var(--bg))] text-(--sub) hover:text-(--text)',
  outline:
    'border border-(--sub)/35 text-(--sub) hover:text-(--text)',
  ghost: 'text-(--sub) hover:text-(--text)',
}

const sizeClassMap: Record<ButtonSize, string> = {
  md: 'px-4 py-2 t-input',
  lg: 'px-4 py-3 t-button-lg',
}

function Button(props: ButtonProps) {
  const [local, rest] = splitProps(props, ['class', 'variant', 'size'])

  return (
    <button
      {...rest}
      class={cn(
        'rounded-lg font-semibold transition disabled:cursor-not-allowed disabled:opacity-60',
        variantClassMap[local.variant ?? 'solid'],
        sizeClassMap[local.size ?? 'md'],
        local.class,
      )}
    />
  )
}

export default Button
