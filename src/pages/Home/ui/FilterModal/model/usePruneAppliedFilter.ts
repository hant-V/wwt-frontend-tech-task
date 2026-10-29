import { useEffect } from 'react'

import { useFilterItemsQuery } from '@api/filter/useFilterItemsQuery'

import { useFilterStore } from '@store/filterStore'

import { pruneFilter } from './filterMapper'

/** Cleans the filter restored from the URL once the real filter items are known. */
export const usePruneAppliedFilter = () => {
	const { data: items } = useFilterItemsQuery()
	const appliedFilter = useFilterStore(state => state.appliedFilter)
	const applyFilter = useFilterStore(state => state.applyFilter)

	useEffect(() => {
		if (!items) {
			return
		}
		const pruned = pruneFilter(appliedFilter, items)
		if (JSON.stringify(pruned) !== JSON.stringify(appliedFilter)) {
			applyFilter(pruned)
		}
	}, [items, appliedFilter, applyFilter])
}
