import { toast } from 'react-toastify';
import { createEffect } from 'effector';

import {
	addUserParameterAdapter,
	addUserParameterOptionAdapter,
	saveUserParameterValueAdapter,
	setAllObjectsValueAdapter,
	updateUserParameterAdapter,
	userParameterDataTypesAdapter,
	userParameterFileAdapter,
	userParameterFilesListAdapter,
	userParameterOptionsAdapter,
	userParametersAdapter,
} from '../../Adapters/userParameters';
import {
	addUserParameterOptionQuery,
	addUserParameterQuery,
	deleteUserParameterFileQuery,
	deleteUserParameterOptionQuery,
	deleteUserParameterQuery,
	getUserParameterDataTypesQuery,
	getUserParameterFileQuery,
	getUserParameterFilesListQuery,
	getUserParameterOptionsQuery,
	getUserParametersListQuery,
	saveUserParameterValueQuery,
	setAllObjectsValueQuery,
	updateUserParameterOptionQuery,
	updateUserParameterQuery,
} from '../../Const/Queries/userParameters';
import {
	AddUserParameterOptionParams,
	AddUserParameterOptionResponse,
	AddUserParameterParams,
	AddUserParameterResponse,
	DeleteUserParameterOptionParams,
	DeleteUserParameterParams,
	GetUserParameterDataTypesParams,
	GetUserParameterFileParams,
	GetUserParameterFileResponse,
	GetUserParameterFilesListParams,
	GetUserParameterOptionsParams,
	SaveUserParameterValueParams,
	SaveUserParameterValueResponse,
	SetAllObjectsValueParams,
	SetAllObjectsValueResponse,
	UpdateUserParameterOptionParams,
	UpdateUserParameterParams,
	UpdateUserParameterResponse,
	UserParametersListParams,
} from '../../Const/Queries/userParameters/types';
import { handleError } from '../../Utils/handleToast';
import { rpcQuery } from '../../Utils/requests';

import {
	setUserParameterDataTypes,
	setUserParameterFilesList,
	setUserParameterOptions,
	setUserParametersList,
	updateUserParametersList,
} from './events';
import {
	NSIUserParameter,
	NSIUserParameterDataType,
	NSIUserParameterFilesListItem,
	NSIUserParameterOption,
} from './types';

export const getUserParametersListFx = createEffect<
	UserParametersListParams,
	NSIUserParameter[]
>('Get user parameters list effect', {
	handler: async (params) => {
		const parametersList = await rpcQuery<NSIUserParameter[]>(
			getUserParametersListQuery(params),
			userParametersAdapter,
		);

		return parametersList;
	},
});

getUserParametersListFx.done.watch(({ params, result }) => {
	if (params.parameterId !== undefined) {
		const updatedParameter = result.find((requestedParameter) => {
			return requestedParameter.id === params.parameterId;
		}) as NSIUserParameter;

		updateUserParametersList(updatedParameter);
	} else {
		setUserParametersList(result);
	}
});

getUserParametersListFx.fail.watch(({ error }) => {
	handleError(error);
});

export const getUserParameterOptionsFx = createEffect<
	GetUserParameterOptionsParams,
	NSIUserParameterOption[]
>('Get user parameter options effect', {
	handler: async (params) => {
		const parameterOptions = await rpcQuery<NSIUserParameterOption[]>(
			getUserParameterOptionsQuery(params),
			userParameterOptionsAdapter,
		);

		return parameterOptions;
	},
});

getUserParameterOptionsFx.done.watch(({ params, result }) => {
	setUserParameterOptions({ parameterId: params.parameterId, options: result });
});

getUserParameterOptionsFx.fail.watch(({ error }) => {
	handleError(error);
});

export const getUserParameterFilesListFx = createEffect<
	GetUserParameterFilesListParams,
	NSIUserParameterFilesListItem[]
>('Get user parameter files list effect', {
	handler: async (params) => {
		const parameterFilesList = await rpcQuery<NSIUserParameterFilesListItem[]>(
			getUserParameterFilesListQuery(params),
			userParameterFilesListAdapter,
		);

		return parameterFilesList;
	},
});

getUserParameterFilesListFx.done.watch(({ params, result }) => {
	setUserParameterFilesList({ valueId: params.valueId, files: result });
});

getUserParameterFilesListFx.fail.watch(({ error }) => {
	handleError(error);
});

export const getUserParameterFileFx = createEffect<
	GetUserParameterFileParams,
	GetUserParameterFileResponse
>('Get user parameter file effect', {
	handler: async (params) => {
		const parameterFile = await rpcQuery<GetUserParameterFileResponse>(
			getUserParameterFileQuery(params),
			userParameterFileAdapter,
		);

		return parameterFile;
	},
});

getUserParameterFileFx.fail.watch(({ error }) => {
	handleError(error);
});

export const deleteUserParameterFileFx = createEffect<
	GetUserParameterFileParams,
	SetAllObjectsValueResponse
>('Delete user parameter file effect', {
	handler: async (params) => {
		const parameterFile = await rpcQuery<SetAllObjectsValueResponse>(
			deleteUserParameterFileQuery(params),
			setAllObjectsValueAdapter,
		);

		return parameterFile;
	},
});

deleteUserParameterFileFx.done.watch(() => {
	toast.success('Файл удален успешно');
});

deleteUserParameterFileFx.fail.watch(({ error }) => {
	handleError(error);
});

export const setAllObjectsValueFx = createEffect<
	SetAllObjectsValueParams,
	SetAllObjectsValueResponse
>('Set all objects value effect', {
	handler: async (params) => {
		const allObjectsValueData = await rpcQuery<SetAllObjectsValueResponse>(
			setAllObjectsValueQuery(params),
			setAllObjectsValueAdapter,
		);

		return allObjectsValueData;
	},
});

setAllObjectsValueFx.done.watch(() => {
	toast.success('Значение изменено для всех подходящих объектов');
});

setAllObjectsValueFx.fail.watch(({ error }) => {
	handleError(error);
});

export const saveUserParameterValueFx = createEffect<
	SaveUserParameterValueParams,
	SaveUserParameterValueResponse
>('Set user parameter value effect', {
	handler: async (params) => {
		const savedParameterValueData =
			await rpcQuery<SaveUserParameterValueResponse>(
				saveUserParameterValueQuery(params),
				saveUserParameterValueAdapter,
			);

		return savedParameterValueData;
	},
});

saveUserParameterValueFx.done.watch(() => {
	toast.success('Значение параметра изменено успешно');
});

saveUserParameterValueFx.fail.watch(({ error }) => {
	handleError(error);
});

export const getUserParameterDataTypesFx = createEffect<
	GetUserParameterDataTypesParams,
	NSIUserParameterDataType[]
>('Get NSI user parameter data types effect', {
	handler: async (params) => {
		const dataTypes = await rpcQuery<NSIUserParameterDataType[]>(
			getUserParameterDataTypesQuery(params),
			userParameterDataTypesAdapter,
		);

		return dataTypes;
	},
});

getUserParameterDataTypesFx.done.watch(({ result }) => {
	setUserParameterDataTypes(result);
});

getUserParameterDataTypesFx.fail.watch(({ error }) => {
	handleError(error);
});

export const addUserParameterFx = createEffect<
	AddUserParameterParams,
	AddUserParameterResponse
>('Add user parameter effect', {
	handler: async (params) => {
		const addedUserParameterData = await rpcQuery<AddUserParameterResponse>(
			addUserParameterQuery(params),
			addUserParameterAdapter,
		);

		return addedUserParameterData;
	},
});

addUserParameterFx.done.watch(() => {
	toast.success('Параметр добавлен успешно');
});

addUserParameterFx.fail.watch(({ error }) => {
	handleError(error);
});

export const addUserParameterOptionFx = createEffect<
	AddUserParameterOptionParams,
	AddUserParameterOptionResponse
>('Add user parameter option effect', {
	handler: async (params) => {
		const addedUserParameterOptionData =
			await rpcQuery<AddUserParameterOptionResponse>(
				addUserParameterOptionQuery(params),
				addUserParameterOptionAdapter,
			);

		return addedUserParameterOptionData;
	},
});

addUserParameterOptionFx.done.watch(() => {
	toast.success('Значение списка добавлено успешно');
});

addUserParameterOptionFx.fail.watch(({ error }) => {
	handleError(error);
});

export const updateUserParameterFx = createEffect<
	UpdateUserParameterParams,
	UpdateUserParameterResponse
>('Update user parameter effect', {
	handler: async (params) => {
		const updatedUserParameterData =
			await rpcQuery<UpdateUserParameterResponse>(
				updateUserParameterQuery(params),
				updateUserParameterAdapter,
			);

		return updatedUserParameterData;
	},
});

updateUserParameterFx.done.watch(() => {
	toast.success('Параметр обновлен успешно');
});

updateUserParameterFx.fail.watch(({ error }) => {
	handleError(error);
});

export const updateUserParameterOptionFx = createEffect<
	UpdateUserParameterOptionParams,
	UpdateUserParameterResponse
>('Update user parameter option effect', {
	handler: async (params) => {
		const updatedUserParameterOptionData =
			await rpcQuery<UpdateUserParameterResponse>(
				updateUserParameterOptionQuery(params),
				updateUserParameterAdapter,
			);

		return updatedUserParameterOptionData;
	},
});

updateUserParameterOptionFx.done.watch(() => {
	toast.success('Значение списка обновлено успешно');
});

updateUserParameterOptionFx.fail.watch(({ error }) => {
	handleError(error);
});

export const deleteUserParameterFx = createEffect<
	DeleteUserParameterParams,
	SetAllObjectsValueResponse
>('Delete user parameter effect', {
	handler: async (params) => {
		const deletedParameterData = await rpcQuery<SetAllObjectsValueResponse>(
			deleteUserParameterQuery(params),
			setAllObjectsValueAdapter,
		);

		return deletedParameterData;
	},
});

deleteUserParameterFx.done.watch(() => {
	toast.success('Параметр удален успешно');
});

deleteUserParameterFx.fail.watch(({ error }) => {
	handleError(error);
});

export const deleteUserParameterOptionFx = createEffect<
	DeleteUserParameterOptionParams,
	SetAllObjectsValueResponse
>('Delete user parameter option effect', {
	handler: async (params) => {
		const deletedParameterData = await rpcQuery<SetAllObjectsValueResponse>(
			deleteUserParameterOptionQuery(params),
			setAllObjectsValueAdapter,
		);

		return deletedParameterData;
	},
});

deleteUserParameterOptionFx.done.watch(() => {
	toast.success('Значение списка удалено успешно');
});

deleteUserParameterOptionFx.fail.watch(({ error }) => {
	handleError(error);
});
