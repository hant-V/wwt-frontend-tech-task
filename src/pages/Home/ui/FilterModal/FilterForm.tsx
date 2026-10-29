import { FormEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useFilterItemsQuery } from '@api/filter/useFilterItemsQuery'

import { Button, EButtonVariant } from '@components/Button'
import { useFilterStore } from '@store/filterStore'

import { ConfirmApplyDialog } from './ConfirmApplyDialog'
import { FilterSection } from './FilterSection'
import { toDraft, toSearchRequestFilter } from './model/filterMapper'
import { useFilterDraft } from './model/useFilterDraft'

const EMPTY_IDS: string[] = []

interface FilterFormProps {
	onClose: () => void
}

export const FilterForm = ({ onClose }: FilterFormProps) => {
	const { t } = useTranslation()
	const { data: items = [], isPending, isError } = useFilterItemsQuery()
	const appliedFilter = useFilterStore(state => state.appliedFilter)
	const applyFilter = useFilterStore(state => state.applyFilter)
	const { draft, toggleOption, clear } = useFilterDraft(() =>
		toDraft(appliedFilter)
	)
	const [isConfirmOpen, setConfirmOpen] = useState(false)

	const handleSubmit = (event: FormEvent) => {
		event.preventDefault()
		setConfirmOpen(true)
	}

	const handleConfirm = () => {
		applyFilter(toSearchRequestFilter(draft, items))
		setConfirmOpen(false)
		onClose()
	}

	const handleReject = () => {
		setConfirmOpen(false)
		onClose()
	}

	return (
		<form
			onSubmit={handleSubmit}
			className="flex min-h-0 flex-col"
		>
			<div className="overflow-y-auto px-7.5 py-5">
				{isPending && <p role="status">{t('loading')}</p>}
				{isError && <p role="alert">{t('error')}</p>}
				{items.map(item => (
					<FilterSection
						key={item.id}
						filter={item}
						selectedIds={draft[item.id] ?? EMPTY_IDS}
						onToggle={toggleOption}
					/>
				))}
			</div>
			<footer className="relative flex flex-col items-center justify-center before:absolute before:inset-x-7.5 before:top-0 before:h-px before:bg-divider px-8 pt-6 pb-8">
				<Button
					type="submit"
					disabled={isPending || isError}
					className="min-w-40"
				>
					{t('apply')}
				</Button>
				<Button
					variant={EButtonVariant.LINK}
					onClick={clear}
					className="mt-2.5 sm:absolute sm:right-8 sm:mt-0"
				>
					{t('clearAll')}
				</Button>
			</footer>
			<ConfirmApplyDialog
				isOpen={isConfirmOpen}
				onConfirm={handleConfirm}
				onReject={handleReject}
				onDismiss={() => setConfirmOpen(false)}
			/>
		</form>
	)
}
