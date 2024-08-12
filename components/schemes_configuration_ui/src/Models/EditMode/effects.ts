import { toast } from 'react-toastify';
import { createEffect } from 'effector';

import { createSeriesAdapter } from '../../Adapters/chart/createSeriesAdapter';
import { deleteSeriesAdapter } from '../../Adapters/chart/deleteSeriesAdapter';
import {
	createdDynamicDataAdapter,
	createdStatusIndicatorDataAdapter,
	createdTransparentDataAdapter,
	formObjectsParametersAdapter,
	formParametersAdapter,
} from '../../Adapters/editingForm/formDataAdapter';
import treeFormDataAdapter from '../../Adapters/treeFormDataAdapter';
import { createSeriesQuery } from '../../Const/Queries/chart';
import {
	fetchFormTreeQuery,
	updateFormNameQuery,
} from '../../Const/Queries/form';
import {
	copyDynamicObjectQuery,
	copyTransparentQuery,
	createDynamicObjectQuery,
	createTransparentQuery,
	deleteObjectQuery,
	getFormObjectsParametersQuery,
	getFormParametersQuery,
	updateFormObjectParametersQuery,
	updateFormParameterQuery,
} from '../../Const/Queries/formObjects';
import { uploadImageQuery } from '../../Const/Queries/image';
import {
	copyStatusIndicatorQuery,
	createStatusIndicator,
} from '../../Const/Queries/statusIndicator';
import {
	ChangeFormNameParams,
	CopyFormObjectParams,
	CreateObjectParams,
	CreateSeriesParams,
	CreateSeriesResponse,
	DeleteFormObjectParams,
	FetchFormObjectParametersParams,
	FetchFormParametersParams,
	UpdateFormObjectParameterParams,
	UpdateFormParameterParams,
	UploadImageParams,
} from '../../Shared/types';
import { ModuleName } from '../../Shared/Types/moduleName';
import {
	checkResponseOutputWarnings,
	handleError,
} from '../../Utils/handleToast';
import { rpcQuery } from '../../Utils/requests';
import { FormTreeDataResponse } from '../TreeForms/types';

import {
	deleteDynamicObject,
	deleteStatusIndicator,
	deleteTransparent,
	setDataForEditing,
	setFormSelectedStatus,
	setObjectParameters,
} from './events';
import {
	CreatedDynamicObject,
	CreatedStatusIndicator,
	CreatedTransparent,
} from './types';
import { FormObjectParameters, FormParameters } from './types';

function handleErrorResponse({ error }: { error: Error }) {
	handleError(error);
	setDataForEditing({ isLoading: false });
}

export const fetchFormParametersFx = createEffect(
	async ({ formId, versionCode }: FetchFormParametersParams) => {
		const formParameters = await rpcQuery<FormParameters[]>(
			getFormParametersQuery(formId, versionCode),
			formParametersAdapter,
			checkResponseOutputWarnings,
		);
		return { formParameters };
	},
);

fetchFormParametersFx.done.watch(({ result }) => {
	const { formParameters } = result;
	setDataForEditing({ formParameters });
	setFormSelectedStatus(true);
});
fetchFormParametersFx.fail.watch(handleErrorResponse);

export const fetchFormObjectsParametersQuerysFx = createEffect(
	async ({ objectId, versionCode }: FetchFormObjectParametersParams) => {
		const objectParameters = await rpcQuery<FormObjectParameters[]>(
			getFormObjectsParametersQuery(objectId, versionCode),
			formObjectsParametersAdapter,
			checkResponseOutputWarnings,
		);
		return { objectParameters };
	},
);

fetchFormObjectsParametersQuerysFx.done.watch(({ params, result }) => {
	const { objectParameters } = result;
	const { objectId } = params;
	setObjectParameters({ objectId, parameters: objectParameters });
	setDataForEditing({ isLoading: false });
});
fetchFormObjectsParametersQuerysFx.fail.watch(handleErrorResponse);

export const updateFormParameterFx = createEffect(
	async ({
		value,
		parameterCode,
		formId,
		versionCode,
		itHasPairedParameter,
		pairedParameterValue,
	}: UpdateFormParameterParams) => {
		await rpcQuery(
			updateFormParameterQuery(
				formId,
				parameterCode,
				String(value),
				versionCode,
				itHasPairedParameter,
				pairedParameterValue,
			),
		);
	},
);

updateFormParameterFx.done.watch(() => {
	/* 	toast.success('Свойство обновлено'); */
});
updateFormParameterFx.fail.watch(handleErrorResponse);

export const updateFormObjectParameterFx = createEffect(
	async ({
		value,
		parameterCode,
		objectId,
		versionCode,
		itHasPairedParameter,
		pairedParameterValue,
	}: UpdateFormObjectParameterParams) => {
		await rpcQuery(
			updateFormObjectParametersQuery(
				objectId,
				parameterCode,
				String(value),
				versionCode,
				itHasPairedParameter,
				pairedParameterValue,
			),
			/* 			_,
			checkResponseOutputWarnings, */
		);
	},
);

updateFormObjectParameterFx.done.watch(() => {
	/* 	toast.success('Свойство обновлено'); */
});
updateFormObjectParameterFx.fail.watch(handleErrorResponse);

// добавление транспаранта

export const createTransparentFx = createEffect(
	async (params: CreateObjectParams) => {
		const { objectParameters, createdTransparentId, transparentObject } =
			await rpcQuery<CreatedTransparent>(
				createTransparentQuery(params),
				createdTransparentDataAdapter,
				checkResponseOutputWarnings,
			);
		return { objectParameters, createdTransparentId, transparentObject };
	},
);

// добавление динамических объектов

export const createDynamicObjectFx = createEffect(
	async (params: CreateObjectParams) => {
		const { objectDynamicParameters, createdDynamicObjectId, dynamicObject } =
			await rpcQuery<CreatedDynamicObject>(
				createDynamicObjectQuery(params),
				createdDynamicDataAdapter,
				checkResponseOutputWarnings,
			);
		return { objectDynamicParameters, createdDynamicObjectId, dynamicObject };
	},
);
export const createStatusIndicatorFx = createEffect(
	async (params: CreateObjectParams) => {
		const {
			statusIndicatorParameters,
			createdStatusIndicatorId,
			statusIndicator,
		} = await rpcQuery<CreatedStatusIndicator>(
			createStatusIndicator(params),
			createdStatusIndicatorDataAdapter,
			checkResponseOutputWarnings,
		);
		return {
			statusIndicatorParameters,
			createdStatusIndicatorId,
			statusIndicator,
		};
	},
);

createTransparentFx.fail.watch(handleErrorResponse);
createDynamicObjectFx.fail.watch(handleErrorResponse);

export const deleteObjectFx = createEffect(
	async (params: DeleteFormObjectParams) => {
		await rpcQuery(deleteObjectQuery(params));
	},
);

deleteObjectFx.done.watch(({ params: { objectId } }) => {
	toast.success('Объект удален');
	deleteTransparent(objectId);
	deleteDynamicObject(objectId);
	deleteStatusIndicator(objectId);
});

deleteObjectFx.fail.watch(handleErrorResponse);

export const copyTransparentFx = createEffect(
	async (params: CopyFormObjectParams) => {
		const response = await rpcQuery<CreatedTransparent>(
			copyTransparentQuery(params),
			createdTransparentDataAdapter,
			checkResponseOutputWarnings,
		);

		return response;
	},
);
copyTransparentFx.fail.watch(handleErrorResponse);

export const copyDynamicObjectFx = createEffect(
	async (params: CopyFormObjectParams) => {
		const response = await rpcQuery<CreatedDynamicObject>(
			copyDynamicObjectQuery(params),
			createdDynamicDataAdapter,
			checkResponseOutputWarnings,
		);
		return response;
	},
);

export const copyStatusIndicatorFx = createEffect(
	async (params: CopyFormObjectParams) => {
		const response = await rpcQuery<CreatedStatusIndicator>(
			copyStatusIndicatorQuery(params),
			createdStatusIndicatorDataAdapter,
			checkResponseOutputWarnings,
		);
		return response;
	},
);

copyDynamicObjectFx.fail.watch(handleErrorResponse);

deleteObjectFx.fail.watch(handleErrorResponse);

export const uploadImageFx = createEffect(async (params: UploadImageParams) => {
	return await rpcQuery<string>(uploadImageQuery(params));
});
uploadImageFx.fail.watch((payload) => {
	handleErrorResponse(payload);
});
export const fetchFormInfoForEditingFx = createEffect(
	(params: FetchFormParametersParams) => {
		fetchFormParametersFx(params);
	},
);

export const createSeriesFx = createEffect(
	async (params: CreateSeriesParams) => {
		const response = await rpcQuery<CreateSeriesResponse>(
			createSeriesQuery(params),
			createSeriesAdapter,
		);
		return response;
	},
);

export const deleteSeriesFx = createEffect(
	async (params: DeleteFormObjectParams) => {
		const deletedCount = rpcQuery<number>(
			deleteObjectQuery(params),
			deleteSeriesAdapter,
		);
		return deletedCount;
	},
);

export const changeFormNameFx = createEffect(
	async (params: ChangeFormNameParams) => {
		return await rpcQuery<number>(updateFormNameQuery(params));
	},
);
changeFormNameFx.done.watch(() => {
	toast.success('Имя формы обновлено');
});
changeFormNameFx.fail.watch(handleErrorResponse);

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
