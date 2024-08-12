import { createStore, sample } from 'effector';

import { fetchInputFormDatasetFx } from './effects';
import { setDataset, toggleRefresh } from './events';
import { InputFormDataset } from './types';

export const $refresh = createStore<boolean>(false);

$refresh.on(toggleRefresh, (state) => !state);

export const $inputFormDataset = createStore<InputFormDataset[]>([]);

$inputFormDataset.on(setDataset, (state, payload) => payload);

sample({
	clock: fetchInputFormDatasetFx.doneData,
	target: setDataset,
});
