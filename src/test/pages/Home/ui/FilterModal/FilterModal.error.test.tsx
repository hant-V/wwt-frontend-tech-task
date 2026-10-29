import { screen } from '@testing-library/react'

import { renderWithQuery } from '@/test/renderWithQuery.tsx'
import { FilterModal } from '@pages/Home/ui/FilterModal'

vi.mock('@api/filter/getFilterItems', () => ({
	getFilterItems: vi.fn().mockRejectedValue(new Error('network'))
}))

describe('FilterModal when loading fails', () => {
	it('shows an error and does not allow applying', async () => {
		renderWithQuery(
			<FilterModal
				isOpen
				onClose={vi.fn()}
			/>
		)

		expect(await screen.findByRole('alert')).toHaveTextContent(
			'Failed to load filters'
		)
		expect(screen.queryByRole('button', { name: 'Apply' })).toBeDisabled()
	})
})
