import { useCallback } from 'react';
import { useStore } from 'effector-react';

import { closeModal, openModal } from '../../Models/Modal/events';
import { $editReportItemData } from '../../Models/ReferenseByReports';
import { setEditReportItemData } from '../../Models/ReferenseByReports/events';
import { RegisteredModals } from '../../Shared/modalsConfig';

export function useConfirmationsFromReportItem(selectedPoint: number | null) {
	const editReportItemData = useStore($editReportItemData);

	// Закрытие модального окна из Точек учета
	const closeModalFromReportItems = useCallback(() => {
		closeModal(RegisteredModals.EditLinkedPointFromReportItem);
		openModal(RegisteredModals.EditReportItem);
	}, []);

	const submitFromReportItems = useCallback(() => {
		setEditReportItemData({
			...editReportItemData,
			pointId: selectedPoint,
		});
		closeModalFromReportItems();
	}, [editReportItemData, selectedPoint, closeModalFromReportItems]);

	return {
		submitFromReportItems,
		closeModalFromReportItems,
	};
}
