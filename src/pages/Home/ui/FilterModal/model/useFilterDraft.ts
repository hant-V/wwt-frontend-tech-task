import { useCallback, useState } from 'react'

import { FilterDraft } from './filterMapper'

/** `getInitialDraft` is lazy: it runs once on mount instead of on every render. */
export const useFilterDraft = (getInitialDraft: () => FilterDraft) => {
	const [draft, setDraft] = useState(getInitialDraft)

	// Stable identities let memoized sections skip re-rendering
	const toggleOption = useCallback(
		(filterId: string, optionId: string) =>
			setDraft(current => {
				const selected = current[filterId] ?? []
				return {
					...current,
					[filterId]: selected.includes(optionId)
						? selected.filter(item => item !== optionId)
						: [...selected, optionId]
				}
			}),
		[]
	)

	const clear = useCallback(() => setDraft({}), [])

	return { draft, toggleOption, clear }
}
