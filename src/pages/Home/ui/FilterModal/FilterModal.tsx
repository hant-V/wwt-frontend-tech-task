import { useTranslation } from 'react-i18next'

import { Modal } from '@components/Modal'

import { FilterForm } from './FilterForm'

interface FilterModalProps {
	isOpen: boolean
	onClose: () => void
}

export const FilterModal = ({ isOpen, onClose }: FilterModalProps) => {
	const { t } = useTranslation()

	return (
		<Modal
			isOpen={isOpen}
			title={t('title')}
			closeLabel={t('close')}
			onClose={onClose}
		>
			<FilterForm onClose={onClose} />
		</Modal>
	)
}
