import { createEffect } from 'effector';

import { inputFormPointsDataAdapter } from '../../Adapters/InputFormPoints/inputFormPointsDataAdapter';
import {
	editInputFormPointParameterQuery,
	getInputFormPointsDatasetQuery,
} from '../../Const/Queries/inputFormPoints';
import { handleError } from '../../Utils/handleToast';
import { rpcQuery } from '../../Utils/requests';
import {
	GetPointsDataAction,
	InputFormPointsDataset,
} from '../InputFormPoints/types';

import { EditInputFormPointParameterAction } from './types';

export const fetchEditInputFormPointsFx = createEffect(
	async (params: GetPointsDataAction) => {
		const dataset = await rpcQuery<InputFormPointsDataset>(
			getInputFormPointsDatasetQuery(params),
			inputFormPointsDataAdapter,
		);
		return dataset;
	},
);

fetchEditInputFormPointsFx.fail.watch(({ error }) => {
	handleError(error);
});

export const updateInputFormPointParameterFx = createEffect(
	async (params: EditInputFormPointParameterAction) => {
		const dataset = await rpcQuery(
			editInputFormPointParameterQuery(params),
			inputFormPointsDataAdapter,
		);
		return dataset;
	},
);

updateInputFormPointParameterFx.fail.watch(({ error }) => {
	handleError(error);
});
