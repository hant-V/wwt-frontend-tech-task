import { fireEvent, render, screen } from '@testing-library/react'

import { Button } from '@components/Button'

describe('Button', () => {
	it('is a non-submitting button by default', () => {
		render(<Button>{'Go'}</Button>)

		expect(screen.getByRole('button', { name: 'Go' })).toHaveAttribute(
			'type',
			'button'
		)
	})

	it('does not fire onClick while disabled', () => {
		const onClick = vi.fn()
		render(
			<Button
				disabled
				onClick={onClick}
			>
				{'Go'}
			</Button>
		)

		fireEvent.click(screen.getByRole('button', { name: 'Go' }))

		expect(onClick).not.toHaveBeenCalled()
	})
})
