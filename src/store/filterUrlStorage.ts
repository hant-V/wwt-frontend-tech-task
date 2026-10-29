import { StateStorage } from 'zustand/middleware'

import { FilterType } from '@api/types/Filter'
import { SearchRequestFilter } from '@api/types/SearchRequest/SearchRequestFilter'

// Filter params are namespaced (`filter.<GROUP>=<option>,<option>`) so unrelated query params stay untouched
const PARAM_PREFIX = 'filter.'
const OPTION_SEPARATOR = ','
const SAFE_ID = /^[\w-]+$/

const isFilterParam = (key: string) => key.startsWith(PARAM_PREFIX)

const buildUrl = (params: URLSearchParams) => {
	const query = params.toString()
	return `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`
}

const removeFilterParams = (params: URLSearchParams) =>
	[...params.keys()].filter(isFilterParam).forEach(key => params.delete(key))

/** The URL is untrusted input: anything that is not a plain id is dropped. */
const parseFilter = (params: URLSearchParams): SearchRequestFilter =>
	[...params.entries()]
		.filter(([key]) => isFilterParam(key))
		.map(([key, value]) => ({
			id: key.slice(PARAM_PREFIX.length),
			type: FilterType.OPTION as const,
			optionsIds: value
				.split(OPTION_SEPARATOR)
				.filter(option => SAFE_ID.test(option))
		}))
		.filter(item => SAFE_ID.test(item.id) && item.optionsIds.length)

/** zustand `persist` storage that keeps the applied filter in the URL query string. */
export const filterUrlStorage: StateStorage = {
	getItem: () => {
		const appliedFilter = parseFilter(
			new URLSearchParams(window.location.search)
		)
		return appliedFilter.length
			? JSON.stringify({ state: { appliedFilter }, version: 0 })
			: null
	},
	setItem: (_name, value) => {
		const params = new URLSearchParams(window.location.search)
		removeFilterParams(params)
		const { state } = JSON.parse(value) as {
			state: { appliedFilter: SearchRequestFilter }
		}
		state.appliedFilter.forEach(item =>
			params.set(
				`${PARAM_PREFIX}${item.id}`,
				item.optionsIds.join(OPTION_SEPARATOR)
			)
		)
		window.history.replaceState(null, '', buildUrl(params))
	},
	removeItem: () => {
		const params = new URLSearchParams(window.location.search)
		removeFilterParams(params)
		window.history.replaceState(null, '', buildUrl(params))
	}
}
