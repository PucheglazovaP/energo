import { createStore, sample } from 'effector';

import { fetchInputFormHeaderFx } from './effects';
import { setHeader } from './events';
import { InputFormHeader } from './types';

export const $inputFormHeader = createStore<InputFormHeader[]>([]);

$inputFormHeader.on(setHeader, (state, payload) => payload);

sample({
	clock: fetchInputFormHeaderFx.doneData,
	target: setHeader,
});
