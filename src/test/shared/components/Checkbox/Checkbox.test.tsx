import { fireEvent, render, screen } from '@testing-library/react'

import { Checkbox } from '@components/Checkbox'

describe('Checkbox', () => {
	it('is labelled and reports changes', () => {
		const onChange = vi.fn()
		render(
			<Checkbox
				label="Wi-Fi"
				checked={false}
				onChange={onChange}
			/>
		)

		fireEvent.click(screen.getByRole('checkbox', { name: 'Wi-Fi' }))

		expect(onChange).toHaveBeenCalledTimes(1)
	})

	it('reflects the checked state', () => {
		render(
			<Checkbox
				label="Wi-Fi"
				checked
				onChange={vi.fn()}
			/>
		)

		expect(screen.getByRole('checkbox', { name: 'Wi-Fi' })).toBeChecked()
	})
})
