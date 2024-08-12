import { createEffect } from 'effector';

import { inputFormPointsHeaderAdapter } from '../../Adapters/InputFormPoints/inputFormPointsHeaderAdapter';
import { getInputFormPointsHeaderQuery } from '../../Const/Queries/inputFormPoints';
import { handleError } from '../../Utils/handleToast';
import { rpcQuery } from '../../Utils/requests';

import { GetPointsHeaderAction, InputFormPointsHeader } from './types';

export const fetchInputFormPointsHeaderFx = createEffect(
	async (params: GetPointsHeaderAction) => {
		const header = await rpcQuery<InputFormPointsHeader[]>(
			getInputFormPointsHeaderQuery(params),
			inputFormPointsHeaderAdapter,
		);
		return header;
	},
);

fetchInputFormPointsHeaderFx.fail.watch(({ error }) => {
	handleError(error);
});
