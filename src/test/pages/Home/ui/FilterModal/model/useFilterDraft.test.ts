import { act, renderHook } from '@testing-library/react'

import { useFilterDraft } from '@pages/Home/ui/FilterModal/model/useFilterDraft'

describe('useFilterDraft', () => {
	it('toggles an option on and off', () => {
		const { result } = renderHook(() => useFilterDraft(() => ({})))

		act(() => result.current.toggleOption('GROUP_A', 'a1'))
		expect(result.current.draft).toEqual({ GROUP_A: ['a1'] })

		act(() => result.current.toggleOption('GROUP_A', 'a1'))
		expect(result.current.draft).toEqual({ GROUP_A: [] })
	})

	it('starts from the initial draft and clears it', () => {
		const { result } = renderHook(() =>
			useFilterDraft(() => ({ GROUP_A: ['a1'] }))
		)
		expect(result.current.draft).toEqual({ GROUP_A: ['a1'] })

		act(() => result.current.clear())
		expect(result.current.draft).toEqual({})
	})

	it('computes the initial draft only once', () => {
		const getInitialDraft = vi.fn(() => ({}))
		const { rerender } = renderHook(() => useFilterDraft(getInitialDraft))

		rerender()
		rerender()

		expect(getInitialDraft).toHaveBeenCalledTimes(1)
	})

	it('keeps callback identities stable across renders', () => {
		const { result } = renderHook(() => useFilterDraft(() => ({})))
		const { toggleOption, clear } = result.current

		act(() => result.current.toggleOption('GROUP_A', 'a1'))

		expect(result.current.toggleOption).toBe(toggleOption)
		expect(result.current.clear).toBe(clear)
	})
})
