import { useCallback } from 'react';
import { useStore } from 'effector-react';

import { $user } from '../../Models/Auth';
import { closeModal } from '../../Models/Modal/events';
import { $visualizationGroupsTable } from '../../Models/VisualizationGroups';
import { deleteVisualizationGroupFx } from '../../Models/VisualizationGroups/effects';
import { VisualizationGroupList } from '../../Models/VisualizationGroups/types';
import { RegisteredModals } from '../../Shared/modalsConfig';
import { ModuleName } from '../../Shared/Types/moduleName';

export function useDeleteVisualizationGroup() {
	const user = useStore($user);
	const { visualizationGroups, currentVisualizationGroupId } = useStore(
		$visualizationGroupsTable,
	);

	// Выбранная через контекстное меню группа
	const currentVisualizationGroup = visualizationGroups.find(
		(visualizationGroups) =>
			visualizationGroups.visualizationGroupId === currentVisualizationGroupId,
	) as VisualizationGroupList;

	const handleCloseModal = useCallback(() => {
		closeModal(RegisteredModals.DeleteVisualizationGroup);
	}, []);

	// Колбек для удаления группы
	const handleConfirmDelete = useCallback(() => {
		if (!user) return;
		deleteVisualizationGroupFx({
			visualizationGroupId: currentVisualizationGroup.visualizationGroupId,
			lastModified: currentVisualizationGroup.lastModified,
			userId: user.preferredUsername,
			moduleName:
				ModuleName.UseDeleteVisualizationGroup_deleteVisualizationGroupFx,
		});
		closeModal(RegisteredModals.DeleteVisualizationGroup);
	}, [
		user,
		currentVisualizationGroup.visualizationGroupId,
		currentVisualizationGroup.lastModified,
	]);

	return {
		handleCloseModal,
		handleConfirmDelete,
	};
}
