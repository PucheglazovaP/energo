import { useCallback } from 'react';
import { useStore } from 'effector-react';

import { $accountingNode } from '../../Models/AccountingNode';
import { setAccountingNode } from '../../Models/AccountingNode/events';
import { closeModal, openModal } from '../../Models/Modal/events';
import { $editPointData } from '../../Models/Points';
import { setEditPointData } from '../../Models/Points/events';
import { RegisteredModals } from '../../Shared/modalsConfig';

export function useConfirmationsFromAccountingNode(
	selectedPoint: number | null,
) {
	const editPointData = useStore($editPointData);
	const accountingNode = useStore($accountingNode);

	// Закрытие модального окна из Узла учета
	const closeModalFromAccountingNode = useCallback(() => {
		closeModal(RegisteredModals.EditLinkedPointFromAccountingNode);
		openModal(RegisteredModals.AccountingNodeModal);
	}, []);

	const submitFromAccountingNode = useCallback(() => {
		setAccountingNode({
			...accountingNode,
			pointId: selectedPoint,
		});
		setEditPointData({
			...editPointData,
			linkedPointId: selectedPoint,
		});
		closeModalFromAccountingNode();
	}, [
		editPointData,
		selectedPoint,
		accountingNode,
		closeModalFromAccountingNode,
	]);

	return {
		submitFromAccountingNode,
		closeModalFromAccountingNode,
	};
}
