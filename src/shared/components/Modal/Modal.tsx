import {
	KeyboardEvent,
	MouseEvent,
	ReactNode,
	SyntheticEvent,
	useEffect,
	useId,
	useRef
} from 'react'

import CloseIcon from '@assets/icons/CloseIcon.svg'

import { EModalVariant } from './type/EModalVariant'

const HEADER_CLASSES: Record<EModalVariant, string> = {
	[EModalVariant.DEFAULT]:
		'px-4 py-5 after:absolute after:inset-x-7.5 after:bottom-0 after:h-px after:bg-divider sm:px-8 sm:py-6',
	[EModalVariant.DIALOG]: 'p-6.5'
}

const CLOSE_CLASSES: Record<EModalVariant, string> = {
	[EModalVariant.DEFAULT]: 'right-4 sm:right-8',
	[EModalVariant.DIALOG]: 'right-6.5'
}

interface ModalProps {
	variant?: EModalVariant
	isOpen: boolean
	title: string
	closeLabel: string
	onClose: () => void
	children: ReactNode
}

export const Modal = ({
	variant = EModalVariant.DEFAULT,
	isOpen,
	title,
	closeLabel,
	onClose,
	children
}: ModalProps) => {
	const dialogRef = useRef<HTMLDialogElement>(null)
	const titleId = useId()

	useEffect(() => {
		const dialog = dialogRef.current
		if (!dialog) {
			return
		}
		if (isOpen && !dialog.open) {
			dialog.showModal()
		} else if (!isOpen && dialog.open) {
			dialog.close()
		}
	}, [isOpen])

	// Esc is handled on keydown: the browser would otherwise send `cancel` to every open dialog,
	// so one press in the confirmation would also close the filter modal underneath it
	const handleKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
		if (event.key === 'Escape') {
			event.preventDefault()
			event.stopPropagation()
			onClose()
		}
	}

	const handleCancel = (event: SyntheticEvent) => {
		// The parent owns the open state, so Esc must not close the dialog on its own
		event.preventDefault()
		onClose()
	}

	const handleBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
		if (event.target === event.currentTarget) {
			onClose()
		}
	}

	return (
		<dialog
			ref={dialogRef}
			aria-labelledby={titleId}
			onCancel={handleCancel}
			onKeyDown={handleKeyDown}
			onClick={handleBackdropClick}
			className="m-auto w-[calc(100%-2rem)] rounded-2xl sm:w-[calc(100%-10rem)] bg-white p-0 backdrop:bg-black/60"
		>
			{isOpen && (
				<div className="flex max-h-[calc(100dvh-2rem)] flex-col sm:max-h-[calc(100dvh-10rem)]">
					<header
						className={`relative flex items-center justify-center ${HEADER_CLASSES[variant]}`}
					>
						<h2
							id={titleId}
							className="px-8 text-center text-xl leading-none font-medium text-ink sm:px-0 sm:text-[40px]"
						>
							{title}
						</h2>
						<button
							type="button"
							onClick={onClose}
							aria-label={closeLabel}
							className={`absolute ${CLOSE_CLASSES[variant]} cursor-pointer text-ink hover:text-brand`}
						>
							<CloseIcon className="size-6" />
						</button>
					</header>
					{children}
				</div>
			)}
		</dialog>
	)
}
