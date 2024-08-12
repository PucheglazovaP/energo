import { useCallback } from 'react';
import { useStore } from 'effector-react';

import { $user } from '../../Models/Auth';
import { closeModal } from '../../Models/Modal/events';
import { $reportContextMenuId } from '../../Models/ReferenseByReports';
import { deleteReportFx } from '../../Models/Reports/effects';
import { RegisteredModals } from '../../Shared/modalsConfig';
import { ModuleName } from '../../Shared/Types/moduleName';

export function useDeleteReport() {
	const user = useStore($user);
	const currentReportId = useStore($reportContextMenuId);

	const handleCloseModal = useCallback(() => {
		closeModal(RegisteredModals.DeleteReport);
	}, []);

	// Callback для удаления отопительного сезона
	const handleConfirmDelete = useCallback(() => {
		if (!user) return;
		deleteReportFx({
			id: currentReportId,
			userId: user.preferredUsername,
			moduleName: ModuleName.UseDeleteReport_deleteReportFx,
		});
		closeModal(RegisteredModals.DeleteReport);
	}, [currentReportId, user]);

	return {
		handleCloseModal,
		handleConfirmDelete,
	};
}
