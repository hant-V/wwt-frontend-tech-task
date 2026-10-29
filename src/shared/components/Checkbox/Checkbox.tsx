import { InputHTMLAttributes, memo } from 'react'

interface CheckboxProps
	extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'children'> {
	label: string
}

const CheckboxComponent = ({
	label,
	className = '',
	...rest
}: CheckboxProps) => (
	<label
		className={`flex cursor-pointer items-center gap-3 text-[11.2px] leading-none sm:text-base font-normal text-ink ${className}`}
	>
		<input
			type="checkbox"
			className="size-[16.8px] sm:size-6 shrink-0 cursor-pointer checkbox-mark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
			{...rest}
		/>
		{label}
	</label>
)

/** Memoized: it re-renders only when its own props change, so pass a stable `onChange`. */
export const Checkbox = memo(CheckboxComponent)
