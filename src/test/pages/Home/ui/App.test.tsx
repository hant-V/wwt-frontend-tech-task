import { renderWithQuery } from '@test/renderWithQuery'
import { fireEvent, screen, waitFor } from '@testing-library/react'

import { App } from '@pages/Home'
import { useFilterStore } from '@store/filterStore'

const BREAKFAST = { name: 'Breakfast included' }

const openFilter = async () => {
	fireEvent.click(screen.getByRole('button', { name: 'Filter' }))
	await screen.findByRole('checkbox', BREAKFAST)
}

const pressEscape = (element: HTMLElement) =>
	fireEvent.keyDown(element, { key: 'Escape' })

describe('filter modal flow', () => {
	beforeEach(() => useFilterStore.setState({ appliedFilter: [] }))

	it('shows a placeholder instead of an empty array when no filter is applied', () => {
		renderWithQuery(<App />)

		expect(screen.getByText('Filters are empty')).toBeInTheDocument()
	})

	it('shows a loading state and keeps Apply disabled until items arrive', async () => {
		renderWithQuery(<App />)
		fireEvent.click(screen.getByRole('button', { name: 'Filter' }))

		expect(screen.getByRole('status')).toHaveTextContent('Loading...')
		expect(screen.getByRole('button', { name: 'Apply' })).toBeDisabled()

		await screen.findByRole('checkbox', BREAKFAST)
		expect(screen.getByRole('button', { name: 'Apply' })).toBeEnabled()
	})

	it('applies the draft after confirmation and pre-fills it on reopen', async () => {
		renderWithQuery(<App />)
		await openFilter()

		fireEvent.click(screen.getByRole('checkbox', BREAKFAST))
		fireEvent.click(screen.getByRole('button', { name: 'Apply' }))
		fireEvent.click(screen.getByRole('button', { name: 'Apply new filter' }))

		expect(useFilterStore.getState().appliedFilter).toEqual([
			{ id: 'MEAL_OPTIONS', type: 'OPTION', optionsIds: ['breakfast'] }
		])
		expect(screen.getByText(/"breakfast"/)).toBeInTheDocument()

		await openFilter()
		expect(screen.getByRole('checkbox', BREAKFAST)).toBeChecked()
	})

	it('keeps the previous filter when the user chooses the old one', async () => {
		renderWithQuery(<App />)
		await openFilter()

		fireEvent.click(screen.getByRole('checkbox', BREAKFAST))
		fireEvent.click(screen.getByRole('button', { name: 'Apply' }))
		fireEvent.click(screen.getByRole('button', { name: 'Use old filter' }))

		expect(useFilterStore.getState().appliedFilter).toEqual([])
		await waitFor(() =>
			expect(screen.queryByRole('checkbox', BREAKFAST)).toBeNull()
		)
	})

	it('discards changes when the modal is closed with the X button', async () => {
		renderWithQuery(<App />)
		await openFilter()

		fireEvent.click(screen.getByRole('checkbox', BREAKFAST))
		fireEvent.click(screen.getByRole('button', { name: 'Close' }))

		expect(useFilterStore.getState().appliedFilter).toEqual([])
		await waitFor(() =>
			expect(screen.queryByRole('checkbox', BREAKFAST)).toBeNull()
		)
	})

	it('discards changes when the modal is closed with Esc', async () => {
		renderWithQuery(<App />)
		await openFilter()

		fireEvent.click(screen.getByRole('checkbox', BREAKFAST))
		pressEscape(screen.getByRole('dialog', { name: 'Filter' }))

		expect(useFilterStore.getState().appliedFilter).toEqual([])
		await waitFor(() =>
			expect(screen.queryByRole('checkbox', BREAKFAST)).toBeNull()
		)
	})

	it('only dismisses the confirmation on Esc and keeps the draft', async () => {
		renderWithQuery(<App />)
		await openFilter()

		fireEvent.click(screen.getByRole('checkbox', BREAKFAST))
		fireEvent.click(screen.getByRole('button', { name: 'Apply' }))
		pressEscape(
			screen.getByRole('dialog', { name: 'Do you want to apply new filter' })
		)

		expect(
			screen.queryByRole('button', { name: 'Apply new filter' })
		).toBeNull()
		expect(screen.getByRole('checkbox', BREAKFAST)).toBeChecked()
		expect(useFilterStore.getState().appliedFilter).toEqual([])
	})

	it('clears every selected option with "Clear all parameters"', async () => {
		renderWithQuery(<App />)
		await openFilter()

		fireEvent.click(screen.getByRole('checkbox', BREAKFAST))
		fireEvent.click(screen.getByRole('checkbox', { name: 'Parking' }))
		fireEvent.click(
			screen.getByRole('button', { name: 'Clear all parameters' })
		)

		screen
			.getAllByRole('checkbox')
			.forEach(checkbox => expect(checkbox).not.toBeChecked())
	})

	it('removes options that no longer exist from a restored filter', async () => {
		useFilterStore.setState({
			appliedFilter: [
				{
					id: 'MEAL_OPTIONS',
					type: 'OPTION' as never,
					optionsIds: ['breakfast', 'removed-option']
				}
			]
		})
		renderWithQuery(<App />)

		await waitFor(() =>
			expect(useFilterStore.getState().appliedFilter[0].optionsIds).toEqual([
				'breakfast'
			])
		)
	})
})
