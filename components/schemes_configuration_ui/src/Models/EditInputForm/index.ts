import { createStore, sample } from 'effector';

import {
	createInputFormSessionFx,
	fetchEditInputFormDatasetFx,
	updateEditValueFx,
} from './effects';
import {
	setActiveSessionId,
	setEditDataset,
	setEditRow,
	updateEditDataset,
} from './events';
import { EditInputForm } from './types';

export const INITIAL_DATA = {
	sessionId: 0,
	data: [],
};

export const $editInputForm = createStore<EditInputForm>(INITIAL_DATA);

$editInputForm.on(setActiveSessionId, (state, payload) => ({
	...state,
	sessionId: payload,
}));

$editInputForm.on(setEditDataset, (state, payload) => {
	return {
		...state,
		data: payload,
	};
});

$editInputForm.on(updateEditDataset, (state, payload) => {
	return {
		...state,
		data: state.data.map((item) => {
			const updatedRow = payload.find((row) => row.id === item.id);
			return updatedRow || item;
		}),
	};
});

$editInputForm.on(setEditRow, (state, payload) => {
	const updatedData = state.data.map((row) => {
		if (row.id === payload.id) {
			const editColumn = row[payload.columnName as keyof typeof row];
			return {
				...row,
				[payload.columnName as keyof typeof row]:
					typeof editColumn !== 'number'
						? {
								...editColumn,
								val: payload.value,
						  }
						: editColumn,
			};
		}
		return row;
	});
	return { ...state, data: updatedData };
});

sample({
	clock: createInputFormSessionFx.doneData,
	target: setActiveSessionId,
});

sample({
	clock: fetchEditInputFormDatasetFx.doneData,
	target: setEditDataset,
});

sample({
	clock: updateEditValueFx.doneData,
	target: updateEditDataset,
});
