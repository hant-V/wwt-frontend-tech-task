import { filterUrlStorage } from '@store/filterUrlStorage'

const setUrl = (url: string) => window.history.replaceState(null, '', url)
const persisted = (appliedFilter: unknown) =>
	JSON.stringify({ state: { appliedFilter }, version: 0 })

describe('filterUrlStorage', () => {
	beforeEach(() => setUrl('/'))

	it('reads the filter from the URL', () => {
		setUrl('/?filter.MEAL_OPTIONS=breakfast,lunch')

		expect(
			JSON.parse(filterUrlStorage.getItem('key') as string).state.appliedFilter
		).toEqual([
			{ id: 'MEAL_OPTIONS', type: 'OPTION', optionsIds: ['breakfast', 'lunch'] }
		])
	})

	it('returns null without filter params and ignores unsafe values', () => {
		setUrl('/?utm_source=x&filter.BAD=<script>')

		expect(filterUrlStorage.getItem('key')).toBeNull()
	})

	it('writes the filter and keeps unrelated params', () => {
		setUrl('/?utm_source=x&filter.OLD=a')

		filterUrlStorage.setItem(
			'key',
			persisted([
				{ id: 'MEAL_OPTIONS', type: 'OPTION', optionsIds: ['breakfast'] }
			])
		)

		const params = new URLSearchParams(window.location.search)
		expect(params.get('utm_source')).toBe('x')
		expect(params.get('filter.MEAL_OPTIONS')).toBe('breakfast')
		expect(params.has('filter.OLD')).toBe(false)
	})
})
