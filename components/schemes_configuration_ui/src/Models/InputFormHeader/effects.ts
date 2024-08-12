import { createEffect } from 'effector';

import { inputFormHeaderAdapter } from '../../Adapters/InputForm/inputFormHeaderAdapter';
import { getInputFormHeaderQuery } from '../../Const/Queries/inputForms';
import { handleError } from '../../Utils/handleToast';
import { rpcQuery } from '../../Utils/requests';

import { GetHeaderAction, InputFormHeader } from './types';

export const fetchInputFormHeaderFx = createEffect(
	async (params: GetHeaderAction) => {
		const header = await rpcQuery<InputFormHeader[]>(
			getInputFormHeaderQuery(params),
			inputFormHeaderAdapter,
		);
		return header;
	},
);

fetchInputFormHeaderFx.fail.watch(({ error }) => {
	handleError(error);
});
