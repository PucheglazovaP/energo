import { createEffect } from 'effector';

import { inputFormPointsDataAdapter } from '../../Adapters/InputFormPoints/inputFormPointsDataAdapter';
import { getInputFormPointsDatasetQuery } from '../../Const/Queries/inputFormPoints';
import { handleError } from '../../Utils/handleToast';
import { rpcQuery } from '../../Utils/requests';

import { GetPointsDataAction, InputFormPointsDataset } from './types';

export const fetchInputFormPointsDatasetFx = createEffect(
	async (params: GetPointsDataAction) => {
		const dataset = await rpcQuery<InputFormPointsDataset>(
			getInputFormPointsDatasetQuery(params),
			inputFormPointsDataAdapter,
		);
		return dataset;
	},
);

fetchInputFormPointsDatasetFx.fail.watch(({ error }) => {
	handleError(error);
});
