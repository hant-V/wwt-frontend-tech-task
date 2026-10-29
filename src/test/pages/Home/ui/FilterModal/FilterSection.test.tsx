import { fireEvent, render, screen } from '@testing-library/react'

import { FilterItem, FilterType } from '@api/types/Filter'

import { FilterSection } from '@pages/Home/ui/FilterModal/FilterSection'
import { useFilterDraft } from '@pages/Home/ui/FilterModal/model/useFilterDraft'

const items: FilterItem[] = ['FIRST', 'SECOND'].map(group => ({
	id: group,
	name: group,
	type: FilterType.OPTION,
	options: [{ id: `${group}_OPTION`, name: `${group} option` }]
}))

const EMPTY_IDS: string[] = []

const Harness = () => {
	const { draft, toggleOption } = useFilterDraft(() => ({}))

	return (
		<>
			{items.map(item => (
				<FilterSection
					key={item.id}
					filter={item}
					selectedIds={draft[item.id] ?? EMPTY_IDS}
					onToggle={toggleOption}
				/>
			))}
		</>
	)
}

describe('FilterSection', () => {
	it('reflects its selected options', () => {
		render(
			<FilterSection
				filter={items[0]}
				selectedIds={['FIRST_OPTION']}
				onToggle={vi.fn()}
			/>
		)

		expect(screen.getByRole('checkbox', { name: 'FIRST option' })).toBeChecked()
	})

	it('reports the toggled filter and option ids', () => {
		const onToggle = vi.fn()
		render(
			<FilterSection
				filter={items[0]}
				selectedIds={[]}
				onToggle={onToggle}
			/>
		)

		fireEvent.click(screen.getByRole('checkbox', { name: 'FIRST option' }))

		expect(onToggle).toHaveBeenCalledWith('FIRST', 'FIRST_OPTION')
	})

	// A section calls `options.map` exactly once per render, which makes it a render counter
	it('re-renders only the section that was toggled', () => {
		const renders = items.map(item => vi.spyOn(item.options, 'map'))
		render(<Harness />)
		expect(renders.map(spy => spy.mock.calls.length)).toEqual([1, 1])

		fireEvent.click(screen.getByRole('checkbox', { name: 'FIRST option' }))

		expect(renders.map(spy => spy.mock.calls.length)).toEqual([2, 1])
	})
})
