import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { SearchRequestFilter } from '@api/types/SearchRequest/SearchRequestFilter'

import { filterUrlStorage } from './filterUrlStorage'

interface FilterState {
	appliedFilter: SearchRequestFilter
	applyFilter: (filter: SearchRequestFilter) => void
}

export const useFilterStore = create<FilterState>()(
	persist(
		set => ({
			appliedFilter: [],
			applyFilter: appliedFilter => set({ appliedFilter })
		}),
		{
			name: 'applied-filter',
			storage: createJSONStorage(() => filterUrlStorage),
			partialize: state => ({ appliedFilter: state.appliedFilter })
		}
	)
)
