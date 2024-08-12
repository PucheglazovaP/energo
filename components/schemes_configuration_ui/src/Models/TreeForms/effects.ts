import { toast } from 'react-toastify';
import { createEffect } from 'effector';

import treeFormDataAdapter from '../../Adapters/treeFormDataAdapter';
import {
	deleteFormQuery,
	fetchFormTreeQuery,
	moveFormQuery,
	publishFormQuery,
} from '../../Const/Queries/form';
import {
	DeleteFormParams,
	MoveFormParams,
	PublishFormParams,
} from '../../Shared/types';
import { ModuleName } from '../../Shared/Types/moduleName';
import {
	checkResponseOutputWarnings,
	handleError,
} from '../../Utils/handleToast';
import { RpcError, rpcQuery } from '../../Utils/requests';
import { setActiveChartParameters } from '../ActiveChart/events';
import { setActiveFormParameters } from '../ActiveForm/events';

import { loadFirstForm, setFormTree } from './events';
import { FormTreeDataResponse } from './types';

export const fetchFormTreeDataFx = createEffect(
	async (params: {
		versionCode: number;
		userId: string;
		moduleName: ModuleName;
	}) => {
		const { versionCode, userId, moduleName } = params;
		const { diagnosticId, tree } = await rpcQuery<FormTreeDataResponse>(
			fetchFormTreeQuery(versionCode, userId, moduleName),
			treeFormDataAdapter,
			checkResponseOutputWarnings,
		);
		return { tree, diagnosticId };
	},
);

fetchFormTreeDataFx.done.watch(({ params, result }) => {
	const { tree } = result;
	setFormTree({ tree, versionCode: params.versionCode });
});

fetchFormTreeDataFx.fail.watch(({ error }) => {
	handleError(error);
	setActiveChartParameters({ isLoading: false });
	setActiveFormParameters({ isLoading: false });
});

export const moveFormFx = createEffect(async (params: MoveFormParams) => {
	await rpcQuery(moveFormQuery(params));
	await fetchFormTreeDataFx({
		versionCode: params.versionCode,
		userId: params.userId,
		moduleName: ModuleName.MoveFormFx_fetchFormTreeDataFx,
	});
});

export const deleteFormFx = createEffect(async (params: DeleteFormParams) => {
	await rpcQuery(deleteFormQuery(params));
	await fetchFormTreeDataFx({
		versionCode: params.versionCode,
		userId: params.userId,
		moduleName: ModuleName.DeleteFormFx_fetchFormTreeDataFx,
	});
	loadFirstForm({ versionCode: params.versionCode, userId: params.userId });
});

export const publishFormFx = createEffect(async (params: PublishFormParams) => {
	try {
		await rpcQuery(publishFormQuery(params));
		toast.success('Форма успешно опубликована');
		return params.formId;
	} catch (err) {
		if (err instanceof RpcError) {
			err.toastMessage();
		} else {
			toast.error('Что-то пошло не так при публикации формы');
		}
		return 0;
	}
});
