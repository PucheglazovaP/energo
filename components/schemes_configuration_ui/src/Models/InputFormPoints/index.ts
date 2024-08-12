import { createStore, sample } from 'effector';

import { fetchInputFormPointsDatasetFx } from './effects';
import { setPointDataset } from './events';
import { InputFormPointsDataset } from './types';

const INITIAL_STATE = {
	energyResourceId: 0,
	externalT: null,
	externalP: null,
	skrub5DGCal: null,
	skrub6DGCal: null,
	skrub7DGCal: null,
	percFN: null,
	order2KGCal: null,
	order3KGCal: null,
	order2volumeKGCal: null,
	order3volumeKGCal: null,
	volumeKG: null,
	avgCalKG: null,
	partKG: null,
	volumeDG: null,
	avgCalDG: null,
	partDG: null,
	volumePG: null,
	avgCalPG: null,
	partPG: null,
	directionTK9: null,
	directionTK10: null,
	directionTK11: null,
};
export const $inputFormPointsDataset =
	createStore<InputFormPointsDataset>(INITIAL_STATE);

$inputFormPointsDataset.on(setPointDataset, (state, payload) => payload);

sample({
	clock: fetchInputFormPointsDatasetFx.doneData,
	target: setPointDataset,
});
