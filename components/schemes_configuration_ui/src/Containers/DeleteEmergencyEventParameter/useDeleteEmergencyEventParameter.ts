import { useCallback } from 'react';
import { useStore } from 'effector-react';

import { $user } from '../../Models/Auth';
import { $emergencyEventsInfo } from '../../Models/EmergencyEvents';
import { closeModal } from '../../Models/Modal/events';
import { deleteParameterFx } from '../../Models/NewEmergencyEventParameter/effects';
import { $sidebar } from '../../Models/Sidebar';
import { RegisteredModals } from '../../Shared/modalsConfig';
import { ModuleName } from '../../Shared/Types/moduleName';

export function useDeleteEmergencyEventParameter() {
	const user = useStore($user);
	const { contextMenuId } = useStore($sidebar);
	const { tree } = useStore($emergencyEventsInfo);

	const activeParameter = tree.find((item) => item.id === contextMenuId);

	const handleCloseModal = useCallback(() => {
		closeModal(RegisteredModals.DeleteEmergencyEventParameter);
	}, []);

	const handleConfirmDelete = useCallback(() => {
		if (!user) return;
		deleteParameterFx({
			id: contextMenuId,
			userId: user.preferredUsername,
			lastModified: activeParameter?.lastModified || '',
			moduleName: ModuleName.UseDeleteEmergencyEventParameter_deleteParameterFx,
		});
		closeModal(RegisteredModals.DeleteEmergencyEventParameter);
	}, [contextMenuId, user, activeParameter?.lastModified]);

	return {
		handleCloseModal,
		handleConfirmDelete,
	};
}
