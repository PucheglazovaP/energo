import { createEffect } from 'effector';

import { selectOptionsAdapter } from '../../Adapters/InputForm/selectOptionsAdapter';
import { getInputFormOptionsQuery } from '../../Const/Queries/inputForms';
import { InputFormOptionsParams } from '../../Shared/types';
import { ModuleName } from '../../Shared/Types/moduleName';
import { rpcQuery } from '../../Utils/requests';

import { InputFormSelectOptions } from './types';

export const fetchInputFormSelectOptionsFx = createEffect(
	async ({ userId, moduleName = ModuleName.Test }: InputFormOptionsParams) => {
		const options = await rpcQuery<InputFormSelectOptions[]>(
			getInputFormOptionsQuery({ userId, moduleName }),
			selectOptionsAdapter,
		);
		return options;
	},
);
