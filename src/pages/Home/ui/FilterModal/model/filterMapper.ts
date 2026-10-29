import { FilterItem, FilterType } from '@api/types/Filter'
import { SearchRequestFilter } from '@api/types/SearchRequest/SearchRequestFilter'

export type FilterDraft = Record<string, string[]>

export const toDraft = (filter: SearchRequestFilter): FilterDraft =>
	Object.fromEntries(filter.map(item => [item.id, item.optionsIds]))

/** Keeps the order of `items` and drops filters with nothing selected. */
export const toSearchRequestFilter = (
	draft: FilterDraft,
	items: FilterItem[]
): SearchRequestFilter =>
	items
		.filter(item => draft[item.id]?.length)
		.map(item => ({
			id: item.id,
			type: FilterType.OPTION,
			optionsIds: draft[item.id]
		}))

/** Drops groups and options that no longer exist in `items` (e.g. stale or hand-edited URLs). */
export const pruneFilter = (
	filter: SearchRequestFilter,
	items: FilterItem[]
): SearchRequestFilter =>
	filter
		.map(entry => {
			const item = items.find(candidate => candidate.id === entry.id)
			const known = new Set(item?.options.map(option => option.id))
			return {
				...entry,
				optionsIds: entry.optionsIds.filter(option => known.has(option))
			}
		})
		.filter(entry => entry.optionsIds.length)
