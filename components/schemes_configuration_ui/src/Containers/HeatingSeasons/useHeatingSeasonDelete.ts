import { useCallback } from 'react';
import { useStore } from 'effector-react';

import { $user } from '../../Models/Auth';
import { $heatingSeasons } from '../../Models/HeatingSeasons';
import { deleteHeatingSeasonFx } from '../../Models/HeatingSeasons/effects';
import { closeModal } from '../../Models/Modal/events';
import { RegisteredModals } from '../../Shared/modalsConfig';
import { ModuleName } from '../../Shared/Types/moduleName';

export function useHeatingSeasonDelete() {
	const user = useStore($user);
	const { currentSeasonId } = useStore($heatingSeasons);

	const onCloseModal = useCallback(() => {
		closeModal(RegisteredModals.DeleteHeatingSeason);
	}, []);

	// Callback для удаления отопительного сезона
	const onConfirmDeletion = useCallback(() => {
		if (!user) return;
		deleteHeatingSeasonFx({
			seasonId: currentSeasonId,
			userId: user.preferredUsername,
			moduleName: ModuleName.UseHeatingSeasonDelete_deleteHeatingSeasonFx,
		});
		closeModal(RegisteredModals.DeleteHeatingSeason);
	}, [user, currentSeasonId]);

	return {
		onCloseModal,
		onConfirmDeletion,
	};
}
