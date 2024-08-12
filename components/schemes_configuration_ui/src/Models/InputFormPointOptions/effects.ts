import { createEffect } from 'effector';

import { selectPointOptionsAdapter } from '../../Adapters/InputForm/selectPointOptionsAdapter';
import { getInputFormPointOptionsQuery } from '../../Const/Queries/inputFormPoints';
import { rpcQuery } from '../../Utils/requests';

import { InputFormOptionsParams, InputFormPointOptions } from './types';

export const fetchInputFormPointOptionsFx = createEffect(
	async (params: InputFormOptionsParams) => {
		const options = await rpcQuery<InputFormPointOptions[]>(
			getInputFormPointOptionsQuery(params),
			selectPointOptionsAdapter,
		);
		return options;
	},
);
