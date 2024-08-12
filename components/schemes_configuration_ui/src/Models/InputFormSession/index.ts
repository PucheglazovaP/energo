import { createStore, sample } from 'effector';

import { fetchInputFormSessionFx } from './effects';
import { setSessionInfo } from './events';
import { EditInputFormSession } from './types';

const INITIAL_DATA = {
	sessionId: 0,
	errorMessage: '',
};

export const $inputFormSession =
	createStore<EditInputFormSession>(INITIAL_DATA);

$inputFormSession.on(setSessionInfo, (_, payload) => payload);

sample({
	clock: fetchInputFormSessionFx.doneData,
	target: setSessionInfo,
});
