import { createStore, sample } from 'effector';

import {
	editEnergyResourceBaseHourFx,
	fetchEnergyResourcesListFx,
} from './effects';
import {
	changeEnergyResource,
	setEnergyResourceId,
	setEnergyResourcesList,
} from './events';
import { EnergyResource } from './types';

export const DEFAULT_ENERGY_RESOURCES_ID = 2;

export const $energyResources = createStore<EnergyResource[]>([]);
$energyResources
	.on(setEnergyResourcesList, (_state, data) => data)
	.on(changeEnergyResource, (_state, data) => data);

export const $energyResourceId = createStore<number>(
	DEFAULT_ENERGY_RESOURCES_ID,
);

$energyResourceId.on(setEnergyResourceId, (_state, payload) => payload);

sample({
	clock: changeEnergyResource,
	fn: (energyResources) => {
		return (
			Number(energyResources.find((item) => item.isSelected)?.value) ||
			DEFAULT_ENERGY_RESOURCES_ID
		);
	},
	target: setEnergyResourceId,
});

sample({
	clock: editEnergyResourceBaseHourFx.doneData,
	target: fetchEnergyResourcesListFx,
});
