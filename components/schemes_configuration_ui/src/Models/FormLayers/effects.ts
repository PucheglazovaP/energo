import { createEffect } from 'effector';

import fetchFormLayersAdapter, {
	editFormLayerAdapter,
} from '../../Adapters/formLayers/formLayersAdapter';
import fetchSystemLayersAdapter, {
	editSystemLayerAdapter,
	fetchSystemLayerFormsAdapter,
} from '../../Adapters/formLayers/systemLayersAdapter';
import {
	changeFormObjectLayer,
	createFormLayer,
	createSystemLayer,
	deleteFormLayer,
	deleteSystemLayer,
	getFormLayers,
	getSystemLayerForms,
	getSystemLayers,
	replaceFormLayer,
	updateSystemLayer,
} from '../../Const/Queries/formLayers';
import {
	ChangeFormObjectLayerParams,
	CreateFormLayerParams,
	CreateSystemLayerParams,
	DeleteFormLayerParams,
	DeleteSystemLayerParams,
	FormLayer,
	GetFormLayersParams,
	GetSystemLayerFormsParams,
	ReplaceFormLayerParams,
	SystemLayer,
	SystemLayerForms,
	SystemLayersInfoParams,
	UpdateSystemLayerParams,
} from '../../Shared/types';
import { rpcQuery } from '../../Utils/requests';

export const getSystemLayersFx = createEffect(
	async (params: SystemLayersInfoParams) => {
		const systemLayersList = await rpcQuery<SystemLayer[]>(
			getSystemLayers(params),
			fetchSystemLayersAdapter,
		);
		return systemLayersList;
	},
);
export const createSystemLayerFx = createEffect(
	async (params: CreateSystemLayerParams) => {
		await rpcQuery(createSystemLayer(params));
	},
);
export const getCurrentFormLayersFx = createEffect(
	async (params: GetFormLayersParams) => {
		const systemLayersList = await rpcQuery<FormLayer[]>(
			getFormLayers(params),
			fetchFormLayersAdapter,
		);
		return systemLayersList;
	},
);
export const deleteSystemLayerFx = createEffect(
	async (params: DeleteSystemLayerParams) => {
		const rowsUpdated = await rpcQuery(
			deleteSystemLayer(params),
			editSystemLayerAdapter,
		);
		return rowsUpdated;
	},
);
export const deleteFormLayerFx = createEffect(
	async (params: DeleteFormLayerParams) => {
		const rowsUpdated = await rpcQuery(
			deleteFormLayer(params),
			editFormLayerAdapter,
		);
		return rowsUpdated;
	},
);
export const createFormLayerFx = createEffect(
	async (params: CreateFormLayerParams) => {
		return await rpcQuery(createFormLayer(params));
	},
);
export const editSystemLayerFx = createEffect(
	async (params: UpdateSystemLayerParams) => {
		const rowsUpdated = await rpcQuery(
			updateSystemLayer(params),
			editSystemLayerAdapter,
		);
		return rowsUpdated;
	},
);
export const changeFormObjectLayerFx = createEffect(
	async (params: ChangeFormObjectLayerParams) => {
		const rowsUpdated = await rpcQuery(
			changeFormObjectLayer(params),
			editFormLayerAdapter,
		);
		return rowsUpdated;
	},
);

export const getSystemLayerFormsFx = createEffect(
	async (params: GetSystemLayerFormsParams) => {
		const systemLayerFormList = await rpcQuery<SystemLayerForms[]>(
			getSystemLayerForms(params),
			fetchSystemLayerFormsAdapter,
		);
		return systemLayerFormList;
	},
);

export const replaceFormLayerFx = createEffect(
	async (params: ReplaceFormLayerParams) => {
		const rowsUpdated = await rpcQuery(
			replaceFormLayer(params),
			editFormLayerAdapter,
		);
		return rowsUpdated;
	},
);
