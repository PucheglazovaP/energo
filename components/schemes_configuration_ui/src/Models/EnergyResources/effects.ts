import { createEffect } from 'effector';

import { energyResourcesAdapter } from '../../Adapters/Points/energyResourcesAdapter';
import {
	getEnergyResourcesQuery,
	updateEnergyResourceBaseHourQuery,
} from '../../Const/Queries/points';
import { rpcQuery } from '../../Utils/requests';
import { EnergyResourceUpdateParams } from '../Points/types';

import { EnergyResource } from './types';

// Запрос энергоресурсов
export const fetchEnergyResourcesListFx = createEffect(async () => {
	const energyResources = await rpcQuery<EnergyResource[]>(
		getEnergyResourcesQuery(),
		energyResourcesAdapter,
	);
	return energyResources;
});

export const editEnergyResourceBaseHourFx = createEffect(
	async (params: EnergyResourceUpdateParams) => {
		const energyResources = await rpcQuery<EnergyResource[]>(
			updateEnergyResourceBaseHourQuery(params),
			energyResourcesAdapter,
		);
		return energyResources;
	},
);
