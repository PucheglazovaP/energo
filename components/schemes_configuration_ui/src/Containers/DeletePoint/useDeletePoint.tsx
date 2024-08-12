import { useCallback } from 'react';
import { useStore } from 'effector-react';

import { $user } from '../../Models/Auth';
import { closeModal } from '../../Models/Modal/events';
import { $contextMenuId, $points } from '../../Models/Points';
import { deletePointFx } from '../../Models/Points/effects';
import { Point } from '../../Models/Points/types';
import { RegisteredModals } from '../../Shared/modalsConfig';
import { ModuleName } from '../../Shared/Types/moduleName';

export function useDeletePoint() {
	const points = useStore($points);
	const currentPointId = useStore($contextMenuId);
	const currentPoint = points.find(
		(point) => point.id === currentPointId,
	) as Point;
	const user = useStore($user);

	const handleCloseModal = useCallback(() => {
		closeModal(RegisteredModals.DeletePoint);
	}, []);

	// Callback для удаления точки учета
	const handleConfirmDelete = useCallback(() => {
		deletePointFx({
			id: currentPoint.id,
			lastModified: currentPoint.lastModified,
			userId: String(user?.preferredUsername),
			moduleName: ModuleName.UseDeletePoint_deletePointFx,
		});
		closeModal(RegisteredModals.DeletePoint);
	}, [currentPoint, user]);

	return {
		handleCloseModal,
		handleConfirmDelete,
	};
}
