import { FilterChoose, FilterItem } from '@api/types/Filter'

import filterData from '@temp/filterData.json'

/** Stands in for the real API call: the endpoint returns the content of filterData.json. */
export const getFilterItems: () => Promise<FilterChoose[]> = async (): Promise<
	FilterItem[]
> => filterData.filterItems as FilterItem[]
