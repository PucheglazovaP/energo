import { useCallback } from 'react';
import { useStore } from 'effector-react';

import { $user } from '../../Models/Auth';
import { closeModal } from '../../Models/Modal/events';
import {
	$contextMenuPrintFormId,
	$selectedPrintFormId,
} from '../../Models/PrintForms';
import {
	deletePrintFormFx,
	fetchPrintFormsFx,
} from '../../Models/PrintForms/effects';
import {
	setContextMenuPrintFormId,
	setSelectedPrintFormId,
} from '../../Models/PrintForms/events';
import { $selectedReportId } from '../../Models/ReferenseByReports';
import { RegisteredModals } from '../../Shared/modalsConfig';
import { ModuleName } from '../../Shared/Types/moduleName';

export function useDeletePrintForm() {
	const user = useStore($user);
	const selectedReportId = useStore($selectedReportId);
	const selectedPrintFormId = useStore($selectedPrintFormId);
	const contextMenuPrintFormId = useStore($contextMenuPrintFormId);

	const handleCloseModal = useCallback(() => {
		closeModal(RegisteredModals.DeletePrintForm);
	}, []);

	const handleConfirmDelete = () => {
		if (!user) return;
		deletePrintFormFx({
			id: contextMenuPrintFormId,
			userId: user.preferredUsername || '',
			moduleName: ModuleName.PrintFormsList_deletePrintFormFx,
		}).then(() => {
			fetchPrintFormsFx(selectedReportId);
		});
		if (selectedPrintFormId === contextMenuPrintFormId) {
			setSelectedPrintFormId(0);
			setContextMenuPrintFormId(0);
		}
		closeModal(RegisteredModals.DeletePrintForm);
	};

	return {
		handleCloseModal,
		handleConfirmDelete,
	};
}
