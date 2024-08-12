import { createEffect } from 'effector';

import { inputFormSessionAdapter } from '../../Adapters/InputForm/inputFormSessionAdapter';
import { getInputFormSessionQuery } from '../../Const/Queries/inputForms';
import { rpcQuery } from '../../Utils/requests';

import { EditInputFormSession, GetInputFormSessionAction } from './types';

export const fetchInputFormSessionFx = createEffect(
	async (params: GetInputFormSessionAction) => {
		const dataset = await rpcQuery<EditInputFormSession>(
			getInputFormSessionQuery(params),
			inputFormSessionAdapter,
		);
		return dataset;
	},
);
