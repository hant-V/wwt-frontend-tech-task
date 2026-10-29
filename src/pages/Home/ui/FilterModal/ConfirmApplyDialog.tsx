import { useTranslation } from 'react-i18next'

import { Button, EButtonVariant } from '@components/Button'
import { EModalVariant, Modal } from '@components/Modal'

interface ConfirmApplyDialogProps {
	isOpen: boolean
	onConfirm: () => void
	onReject: () => void
	onDismiss: () => void
}

export const ConfirmApplyDialog = ({
	isOpen,
	onConfirm,
	onReject,
	onDismiss
}: ConfirmApplyDialogProps) => {
	const { t } = useTranslation()

	return (
		<Modal
			variant={EModalVariant.DIALOG}
			isOpen={isOpen}
			title={t('confirmTitle')}
			closeLabel={t('close')}
			onClose={onDismiss}
		>
			<div className="grid grid-cols-1 gap-4 px-6.5 pt-10 pb-6.5 sm:grid-cols-[repeat(2,16rem)] sm:justify-center sm:gap-6">
				<Button
					variant={EButtonVariant.SECONDARY}
					onClick={onReject}
				>
					{t('useOld')}
				</Button>
				<Button onClick={onConfirm}>{t('applyNew')}</Button>
			</div>
		</Modal>
	)
}
