import { ButtonHTMLAttributes } from 'react'

import { EButtonSize } from './type/EButtonSize'
import { EButtonVariant } from './type/EButtonVariant'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: EButtonVariant
	size?: EButtonSize
}

const BASE_CLASSES =
	'cursor-pointer text-sm transition-colors outline-none disabled:cursor-not-allowed'

const SIZE_CLASSES: Record<EButtonSize, string> = {
	[EButtonSize.LARGE]: 'h-16 px-8',
	[EButtonSize.MEDIUM]: 'h-12 px-8',
	[EButtonSize.SMALL]: 'h-10 px-6'
}

const VARIANT_CLASSES: Record<EButtonVariant, string> = {
	[EButtonVariant.PRIMARY]:
		'rounded-2xl bg-brand font-semibold text-white enabled:hover:bg-brand-hover enabled:active:bg-brand-active disabled:bg-gray-100 disabled:text-gray-400',
	[EButtonVariant.OUTLINE]:
		'rounded-2xl border-2 border-brand font-semibold text-brand enabled:hover:border-brand-hover enabled:hover:text-brand-hover enabled:active:bg-brand enabled:active:text-white disabled:border-gray-300 disabled:text-gray-400',
	[EButtonVariant.SECONDARY]:
		'rounded-2xl border-2 border-neutral-border font-semibold text-ink enabled:hover:bg-neutral-hover disabled:text-gray-400',
	[EButtonVariant.LINK]:
		'text-link underline enabled:hover:text-link-hover disabled:text-gray-400'
}

export const Button = ({
	variant = EButtonVariant.PRIMARY,
	size = EButtonSize.MEDIUM,
	type = 'button',
	className = '',
	...rest
}: ButtonProps) => (
	<button
		type={type}
		className={`${BASE_CLASSES} ${variant === EButtonVariant.LINK ? '' : SIZE_CLASSES[size]} ${VARIANT_CLASSES[variant]} ${className}`}
		{...rest}
	/>
)
