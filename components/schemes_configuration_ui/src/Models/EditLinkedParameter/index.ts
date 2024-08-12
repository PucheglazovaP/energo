import { createStore } from 'effector';

import { setActiveLinkedParameterIdEvent } from './events';
import { EditLinkedParameter } from './types';

const initialStore: EditLinkedParameter = {
	activeLinkedParameterId: null,
};

export const $editLinkedParameter =
	createStore<EditLinkedParameter>(initialStore);

$editLinkedParameter.on(
	setActiveLinkedParameterIdEvent,
	(state, activeLinkedParameterId) => {
		return {
			...state,
			activeLinkedParameterId,
		};
	},
);
