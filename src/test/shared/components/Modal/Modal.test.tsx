import { fireEvent, render, screen } from '@testing-library/react'

import { Modal } from '@components/Modal'

const renderModal = (isOpen = true) => {
	const onClose = vi.fn()
	render(
		<Modal
			isOpen={isOpen}
			title="Title"
			closeLabel="Close it"
			onClose={onClose}
		>
			<p>{'Content'}</p>
		</Modal>
	)
	return onClose
}

describe('Modal', () => {
	it('renders an accessible dialog with title and content when open', () => {
		renderModal()

		expect(screen.getByRole('dialog', { name: 'Title' })).toBeInTheDocument()
		expect(screen.getByText('Content')).toBeInTheDocument()
	})

	it('renders nothing inside while closed', () => {
		renderModal(false)

		expect(screen.queryByText('Content')).toBeNull()
		expect(screen.queryByText('Title')).toBeNull()
	})

	it('calls onClose from the close button', () => {
		const onClose = renderModal()

		fireEvent.click(screen.getByRole('button', { name: 'Close it' }))

		expect(onClose).toHaveBeenCalledTimes(1)
	})

	it('calls onClose on the Escape key and stops it from bubbling to parents', () => {
		const onClose = renderModal()

		fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' })

		expect(onClose).toHaveBeenCalledTimes(1)
	})

	it('calls onClose on a native cancel without closing the dialog itself', () => {
		const onClose = renderModal()
		const event = new Event('cancel', { cancelable: true })

		fireEvent(screen.getByRole('dialog'), event)

		expect(onClose).toHaveBeenCalledTimes(1)
		expect(event.defaultPrevented).toBe(true)
	})

	it('calls onClose on backdrop click but not on clicks inside', () => {
		const onClose = renderModal()

		fireEvent.click(screen.getByText('Content'))
		expect(onClose).not.toHaveBeenCalled()

		fireEvent.click(screen.getByRole('dialog'))
		expect(onClose).toHaveBeenCalledTimes(1)
	})
})
