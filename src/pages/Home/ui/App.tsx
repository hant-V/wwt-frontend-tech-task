import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@components/Button'
import { useFilterStore } from '@store/filterStore'

import { FilterModal } from './FilterModal'
import { usePruneAppliedFilter } from './FilterModal/model/usePruneAppliedFilter'

export const App = () => {
	const { t } = useTranslation()
	const appliedFilter = useFilterStore(state => state.appliedFilter)
	usePruneAppliedFilter()
	const [isFilterOpen, setFilterOpen] = useState(false)

	return (
		<main className="mx-auto flex min-h-dvh max-w-3xl flex-col items-start gap-6 p-8">
			<Button onClick={() => setFilterOpen(true)}>{t('open')}</Button>
			<section
				aria-labelledby="current-filter"
				className="w-full"
			>
				<h2
					id="current-filter"
					className="mb-2 text-xl text-ink"
				>
					{t('currentFilter')}
				</h2>
				{appliedFilter.length ? (
					<pre className="overflow-x-auto rounded-xl bg-gray-100 p-4 text-sm">
						{JSON.stringify(appliedFilter, null, 2)}
					</pre>
				) : (
					<p className="rounded-xl bg-gray-100 p-4 text-sm text-gray-500">
						{t('emptyFilter')}
					</p>
				)}
			</section>
			<FilterModal
				isOpen={isFilterOpen}
				onClose={() => setFilterOpen(false)}
			/>
		</main>
	)
}
