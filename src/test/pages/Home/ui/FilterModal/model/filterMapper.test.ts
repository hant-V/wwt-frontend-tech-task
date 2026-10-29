import { FilterItem, FilterType } from '@api/types/Filter'

import {
	pruneFilter,
	toDraft,
	toSearchRequestFilter
} from '@pages/Home/ui/FilterModal/model/filterMapper'

const items: FilterItem[] = [
	{
		id: 'GROUP_A',
		name: 'A',
		type: FilterType.OPTION,
		options: [{ id: 'a1', name: 'a1' }]
	},
	{
		id: 'GROUP_B',
		name: 'B',
		type: FilterType.OPTION,
		options: [{ id: 'b1', name: 'b1' }]
	}
]

describe('filterMapper', () => {
	it('round-trips a request filter through a draft', () => {
		const filter = [
			{ id: 'GROUP_B', type: FilterType.OPTION as const, optionsIds: ['b1'] }
		]

		expect(toSearchRequestFilter(toDraft(filter), items)).toEqual(filter)
	})

	it('drops filters without selected options', () => {
		expect(
			toSearchRequestFilter({ GROUP_A: [], GROUP_B: ['b1'] }, items)
		).toEqual([{ id: 'GROUP_B', type: FilterType.OPTION, optionsIds: ['b1'] }])
	})

	it('prunes unknown groups and options', () => {
		const filter = [
			{
				id: 'GROUP_A',
				type: FilterType.OPTION as const,
				optionsIds: ['a1', 'gone']
			},
			{ id: 'UNKNOWN', type: FilterType.OPTION as const, optionsIds: ['x1'] }
		]

		expect(pruneFilter(filter, items)).toEqual([
			{ id: 'GROUP_A', type: FilterType.OPTION, optionsIds: ['a1'] }
		])
	})
})
