import { ChangeEvent, memo, useCallback, useId } from 'react'

import { FilterItem } from '@api/types/Filter'

import { Checkbox } from '@components/Checkbox'

interface FilterSectionProps {
	filter: FilterItem
	selectedIds: string[]
	onToggle: (filterId: string, optionId: string) => void
}

const FilterSectionComponent = ({
	filter,
	selectedIds,
	onToggle
}: FilterSectionProps) => {
	const titleId = useId()

	// One handler for every option of the section (the option id travels in `value`), so each Checkbox keeps a stable prop
	const handleChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) =>
			onToggle(filter.id, event.target.value),
		[filter.id, onToggle]
	)

	return (
		<fieldset
			aria-labelledby={titleId}
			className="border-b border-divider py-5 first:pt-0 last:border-b-0 last:pb-0"
		>
			<span
				id={titleId}
				className="mb-4 block text-[16.8px] leading-none font-medium text-ink sm:mb-6 sm:text-2xl"
			>
				{filter.name}
			</span>
			<div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
				{filter.options.map(({ id, name, description }) => (
					<Checkbox
						key={id}
						label={name}
						title={description}
						value={id}
						checked={selectedIds.includes(id)}
						onChange={handleChange}
					/>
				))}
			</div>
		</fieldset>
	)
}

export const FilterSection = memo(FilterSectionComponent)
