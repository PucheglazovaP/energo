import { createStore, sample } from 'effector';

import { fetchInputFormSelectOptionsFx } from './effects';
import { setSelectOptions } from './events';
import { InputFormSelectOptions } from './types';

export const $inputFormSelectOptions = createStore<InputFormSelectOptions[]>(
	[],
);

$inputFormSelectOptions.on(setSelectOptions, (state, payload) => payload);

sample({
	clock: fetchInputFormSelectOptionsFx.doneData,
	target: setSelectOptions,
});
