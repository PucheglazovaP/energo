import { createEffect } from 'effector';

import { inputFormCreateSessionAdapter } from '../../Adapters/InputForm/inputFormCreateSessionAdapter';
import { inputFormDataAdapter } from '../../Adapters/InputForm/inputFormDataAdapter';
import {
	closeInputFormSessionQuery,
	createInputFormSessionQuery,
	getEditInputFormDatasetQuery,
	saveInputFormSessionQuery,
	updateEditValueQuery,
} from '../../Const/Queries/inputForms';
import { handleError } from '../../Utils/handleToast';
import { rpcQuery } from '../../Utils/requests';
import { GetDataAction, InputFormDataset } from '../InputForm/types';

import { GetEditDataAction, UpdateEditValueAction } from './types';

export const createInputFormSessionFx = createEffect(
	async (params: GetDataAction) => {
		const sessionId = await rpcQuery<number>(
			createInputFormSessionQuery(params),
			inputFormCreateSessionAdapter,
		);
		return sessionId;
	},
);

createInputFormSessionFx.fail.watch(({ error }) => {
	handleError(error);
});

export const fetchEditInputFormDatasetFx = createEffect(
	async (params: GetEditDataAction) => {
		const dataset = await rpcQuery<InputFormDataset[]>(
			getEditInputFormDatasetQuery(params),
			inputFormDataAdapter,
		);
		return dataset;
	},
);

fetchEditInputFormDatasetFx.fail.watch(({ error }) => {
	handleError(error);
});

export const updateEditValueFx = createEffect(
	async (params: UpdateEditValueAction) => {
		const dataset = await rpcQuery<InputFormDataset[]>(
			updateEditValueQuery(params),
			inputFormDataAdapter,
		);
		return dataset;
	},
);

updateEditValueFx.fail.watch(({ error }) => {
	handleError(error);
});

export const closeInputFormSessionFx = createEffect(
	async (params: GetEditDataAction) => {
		const sessionId = await rpcQuery<number>(
			closeInputFormSessionQuery(params),
			inputFormCreateSessionAdapter,
		);
		return sessionId;
	},
);

closeInputFormSessionFx.fail.watch(({ error }) => {
	handleError(error);
});

export const saveInputFormSessionFx = createEffect(
	async (params: GetEditDataAction) => {
		const sessionId = await rpcQuery<number>(
			saveInputFormSessionQuery(params),
			inputFormCreateSessionAdapter,
		);
		return sessionId;
	},
);

saveInputFormSessionFx.fail.watch(({ error }) => {
	handleError(error);
});
