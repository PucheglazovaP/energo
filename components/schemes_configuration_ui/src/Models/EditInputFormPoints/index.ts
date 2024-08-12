import { createStore, sample } from 'effector';

import { createInputFormSessionFx } from '../EditInputForm/effects';

import {
	fetchEditInputFormPointsFx,
	updateInputFormPointParameterFx,
} from './effects';
import {
	setEditParameter,
	setEditPoints,
	setPointActiveSessionId,
} from './events';
import { EditInputFormPoints } from './types';

export const INITIAL_DATA: EditInputFormPoints = {
	sessionId: 0,
	data: {
		energyResourceId: 0,
	},
};

export const $editInputFormPoints =
	createStore<EditInputFormPoints>(INITIAL_DATA);

$editInputFormPoints.on(setPointActiveSessionId, (state, payload) => ({
	...state,
	sessionId: payload,
}));

$editInputFormPoints.on(setEditPoints, (state, payload) => {
	return {
		...state,
		data: payload,
	};
});

$editInputFormPoints.on(setEditParameter, (state, payload) => {
	const updatedField = state.data[payload.fieldName as keyof typeof state.data];
	return {
		...state,
		data: {
			...state.data,
			[payload.fieldName as keyof typeof state.data]:
				typeof updatedField !== 'number'
					? {
							...updatedField,
							value: payload.fieldValue,
					  }
					: updatedField,
		},
	};
});

sample({
	clock: createInputFormSessionFx.doneData,
	target: setPointActiveSessionId,
});

sample({
	clock: fetchEditInputFormPointsFx.doneData,
	target: setEditPoints,
});

sample({
	clock: updateInputFormPointParameterFx.doneData,
	target: setEditPoints,
});
