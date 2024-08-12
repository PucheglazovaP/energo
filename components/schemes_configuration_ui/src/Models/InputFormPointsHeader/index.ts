import { createStore, sample } from 'effector';

import { fetchInputFormPointsHeaderFx } from './effects';
import { setPointsHeader } from './events';
import { InputFormPointsHeader } from './types';

export const $inputFormPointsHeader = createStore<InputFormPointsHeader[]>([]);

$inputFormPointsHeader.on(setPointsHeader, (state, payload) => payload);

sample({
	clock: fetchInputFormPointsHeaderFx.doneData,
	target: setPointsHeader,
});
