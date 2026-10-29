import { useQuery } from '@tanstack/react-query'

import { getFilterItems } from './getFilterItems'

export const FILTER_ITEMS_QUERY_KEY = ['filterItems']

export const useFilterItemsQuery = () =>
	useQuery({
		queryKey: FILTER_ITEMS_QUERY_KEY,
		queryFn: getFilterItems,
		staleTime: Infinity
	})
