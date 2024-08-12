import { useCallback } from 'react';
import { useStore } from 'effector-react';

import { closeModal, openModal } from '../../Models/Modal/events';
import { $editPointData } from '../../Models/Points';
import { setEditPointData } from '../../Models/Points/events';
import { RegisteredModals } from '../../Shared/modalsConfig';

export function useConfirmationsFromPoints(selectedPoint: number | null) {
	const editPointData = useStore($editPointData);

	// Закрытие модального окна из Точек учета
	const closeModalFromPoints = useCallback(() => {
		closeModal(RegisteredModals.EditLinkedPoint);
		openModal(RegisteredModals.EditPoint);
	}, []);

	const submitFromPoints = useCallback(() => {
		setEditPointData({
			...editPointData,
			linkedPointId: selectedPoint,
		});
		closeModalFromPoints();
	}, [editPointData, selectedPoint, closeModalFromPoints]);

	return {
		submitFromPoints,
		closeModalFromPoints,
	};
}
