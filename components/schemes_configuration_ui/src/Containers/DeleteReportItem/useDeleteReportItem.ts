import { useCallback } from 'react';
import { useStore } from 'effector-react';

import { $user } from '../../Models/Auth';
import { closeModal } from '../../Models/Modal/events';
import { $reportItemContextMenuId } from '../../Models/ReferenseByReports';
import { deleteReportItemFx } from '../../Models/ReportItems/effects';
import { RegisteredModals } from '../../Shared/modalsConfig';
import { ModuleName } from '../../Shared/Types/moduleName';

export function useDeleteReportItem() {
	const user = useStore($user);
	const currentReportId = useStore($reportItemContextMenuId);

	const handleCloseModal = useCallback(() => {
		closeModal(RegisteredModals.DeleteReportItem);
	}, []);

	// Callback для удаления узла отчета
	const handleConfirmDelete = useCallback(() => {
		if (!user) return;
		deleteReportItemFx({
			id: currentReportId,
			userId: user.preferredUsername,
			moduleName: ModuleName.UseDeleteReportItem_deleteReportItemFx,
		});
		closeModal(RegisteredModals.DeleteReportItem);
	}, [currentReportId, user]);

	return {
		handleCloseModal,
		handleConfirmDelete,
	};
}
