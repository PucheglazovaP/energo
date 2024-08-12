import { createStore, sample } from 'effector';

import { fetchInputFormPointOptionsFx } from './effects';
import { setInputFormPointOptions } from './events';
import { InputFormPointOptions } from './types';

export const $inputFormPointOptions = createStore<InputFormPointOptions[]>([]);

$inputFormPointOptions.on(
	setInputFormPointOptions,
	(state, payload) => payload,
);

sample({
	clock: fetchInputFormPointOptionsFx.doneData,
	target: setInputFormPointOptions,
});
