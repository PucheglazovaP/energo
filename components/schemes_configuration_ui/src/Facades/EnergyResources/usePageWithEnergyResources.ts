import { useCallback, useEffect } from 'react';
import { useStore } from 'effector-react';

import { DEFAULT_ENERGY_RESOURCES_NAME } from '../../Containers/ParameterByValueTable/constants';
import {
	$energyResourceId,
	$energyResources,
} from '../../Models/EnergyResources';
import { fetchEnergyResourcesListFx } from '../../Models/EnergyResources/effects';
import { changeEnergyResource } from '../../Models/EnergyResources/events';
import { EnergyResource } from '../../Models/EnergyResources/types';

function usePageWithEnergyResources() {
	const energyResources = useStore($energyResources);
	const energyResourceId = useStore($energyResourceId);

	// изменение выбранного энергоресурса
	const onChangeEnergyResource = useCallback(
		(energyResources: EnergyResource[]) => {
			changeEnergyResource(energyResources);
		},
		[],
	);

	const energyResourceName: string =
		energyResources.find((item) => item.isSelected)?.label ||
		DEFAULT_ENERGY_RESOURCES_NAME;

	const baseHour: number =
		energyResources.find((item) => item.isSelected)?.baseHour || 0;

	// начальный запрос списка энергоресурсов
	useEffect(() => {
		if (!energyResources.length) fetchEnergyResourcesListFx();
	}, [energyResources]);

	return {
		energyResources,
		onChangeEnergyResource,
		energyResourceId,
		energyResourceName,
		baseHour,
	};
}

export default usePageWithEnergyResources;
