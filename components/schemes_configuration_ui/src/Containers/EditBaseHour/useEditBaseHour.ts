import { useCallback, useEffect, useState } from 'react';
import { useStore } from 'effector-react';

import { $user } from '../../Models/Auth';
import {
	$energyResourceId,
	$energyResources,
} from '../../Models/EnergyResources';
import { editEnergyResourceBaseHourFx } from '../../Models/EnergyResources/effects';
import { closeModal } from '../../Models/Modal/events';
import { RegisteredModals } from '../../Shared/modalsConfig';
import { ModuleName } from '../../Shared/Types/moduleName';

export function useEditBaseHour() {
	const energyResources = useStore($energyResources);
	const energyResourceId = useStore($energyResourceId);
	const user = useStore($user);
	const baseHour =
		energyResources.find((resource) => resource.value === energyResourceId)
			?.baseHour || 0;
	const [hour, setHour] = useState(baseHour);

	const handleSetHour = useCallback((value: number) => {
		setHour(value);
	}, []);

	const handleSubmitHour = useCallback(() => {
		if (!user) return;
		editEnergyResourceBaseHourFx({
			baseHour: hour,
			energyResourceId: energyResourceId,
			userId: user.preferredUsername,
			moduleName: ModuleName.UseEditBaseHour_handleSubmitHour,
		});
		closeModal(RegisteredModals.EditBaseHour);
	}, [hour, user]);

	useEffect(() => {
		setHour(baseHour);
	}, [baseHour]);
	return {
		energyResources,
		energyResourceId,
		baseHour,
		hour,
		handleSetHour,
		handleSubmitHour,
	};
}
