import { createEffect } from 'effector';

import { inputFormDataAdapter } from '../../Adapters/InputForm/inputFormDataAdapter';
import { getInputFormDataQuery } from '../../Const/Queries/inputForms';
import { handleError } from '../../Utils/handleToast';
import { rpcQuery } from '../../Utils/requests';

import { GetDataAction, InputFormDataset } from './types';

export const fetchInputFormDatasetFx = createEffect(
	async (params: GetDataAction) => {
		const dataset = await rpcQuery<InputFormDataset[]>(
			getInputFormDataQuery(params),
			inputFormDataAdapter,
		);
		return dataset;
	},
);

fetchInputFormDatasetFx.fail.watch(({ error }) => {
	handleError(error);
});
