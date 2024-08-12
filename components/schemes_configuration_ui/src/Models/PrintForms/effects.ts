import { toast } from 'react-toastify';
import { createEffect } from 'effector';

import fetchNotSyncedPrintFormParametersAdapter from '../../Adapters/fetchNotSyncedPrintFormParametersAdapter';
import fetchPrintFormParametersAdapter from '../../Adapters/fetchPrintFormParametersAdapter';
import createPrintFormAdapter from '../../Adapters/ReportByPrintForms/createPrintFormAdapter';
import createPrintFormPositionAdapter from '../../Adapters/ReportByPrintForms/createPrintFormPositionAdapter';
import deletePrintFormAdapter from '../../Adapters/ReportByPrintForms/deletePrintFormAdapter';
import deletePrintFormPositionAdapter from '../../Adapters/ReportByPrintForms/deletePrintFormPositionAdapter';
import fetchPrintFormParameterValuesAdapter from '../../Adapters/ReportByPrintForms/fetchPrintFormParameterValuesAdapter';
import fetchPrintFormPositionsAdapter from '../../Adapters/ReportByPrintForms/fetchPrintFormPositionsAdapter';
import { fetchPrintFormsAdapter } from '../../Adapters/ReportByPrintForms/fetchPrintFormsAdapter';
import fetchPrintFormTreeAdapter from '../../Adapters/ReportByPrintForms/fetchPrintFormTreeAdapter';
import { fetchPriorityMethodsAdapter } from '../../Adapters/ReportByPrintForms/fetchPriorityMethodsAdapter';
import movePrintFormPositionAdapter from '../../Adapters/ReportByPrintForms/movePrintFormPositionAdapter';
import savePrintFormPositionSettingsAdapter from '../../Adapters/ReportByPrintForms/savePrintFormPositionSettingsAdapter';
import syncPrintFormParameterAdapter from '../../Adapters/ReportByPrintForms/syncPrintFormParameterAdapter';
import syncPrintFormPositionAdapter from '../../Adapters/ReportByPrintForms/syncPrintFormPositionAdapter';
import unsyncPrintFormPositionAdapter from '../../Adapters/ReportByPrintForms/unsyncPrintFormPositionAdapter';
import udpatePrintFormAdapter from '../../Adapters/ReportByPrintForms/updatePrintFormAdapter';
import {
	addPrintFormParameterValueQuery,
	createPrintFormPositionQuery,
	createPrintFormQuery,
	deletePrintFormParameterValueQuery,
	deletePrintFormPositionQuery,
	deletePrintFormQuery,
	fetchNotSyncedPrintFormParametersQuery,
	fetchPrintFormParametersQuery,
	fetchPrintFormParameterValuesQuery,
	fetchPrintFormPositionsQuery,
	fetchPrintFormsQuery,
	fetchPrintFormTreeQuery,
	fetchPriorityMethodsQuery,
	movePrintFormPositionQuery,
	savePrintFormPositionSettingsQuery,
	syncPrintFormParameterQuery,
	syncPrintFormPositionQuery,
	unsyncPrintFormParameterQuery,
	unsyncPrintFormPositionQuery,
	updatePrintFormParameterValueQuery,
	updatePrintFormQuery,
} from '../../Const/Queries/printFormsQueries';
import {
	AddParameterValuePrintFormParams,
	CommonPrintFormParametersParams,
	CreatePrintFormParams,
	CreatePrintFormPositionParams,
	DeletePrintFormParams,
	DeletePrintFormPositionParams,
	FetchPrintFormParametersParams,
	FetchPrintFormPositionParams,
	FetchPrintFormTreeParams,
	MovePrintFormPositionParams,
	PrintFormParameter,
	PrintFormParameterNotSynced,
	PrintFormParameterValue,
	PrintFormPosition,
	PrintFormTree,
	PriorityMethod,
	SavePrintFormPositionSettingsParams,
	SyncPrintFormParametersParams,
	SyncPrintFormPositionParams,
	UnsyncPrintFormPositionParams,
	UpdatePrintFormParams,
} from '../../Shared/types';
import { RpcError, rpcQuery } from '../../Utils/requests';

import { PrintForm } from './types';

export const fetchPrintFormsFx = createEffect(
	async (reportId: number | null) => {
		try {
			const printForms: PrintForm[] = await rpcQuery<PrintForm[]>(
				fetchPrintFormsQuery(reportId),
				fetchPrintFormsAdapter,
			);
			return printForms;
		} catch (err) {
			if (err instanceof RpcError) {
				err.toastMessage();
			} else {
				toast.error('Что-то пошло не так при загрузке печатных форм');
			}
			return [];
		}
	},
);

export const createPrintFormFx = createEffect(
	async (params: CreatePrintFormParams) => {
		try {
			const { rowsUpdated } = await rpcQuery<
				ReturnType<typeof createPrintFormAdapter>
			>(createPrintFormQuery(params), createPrintFormAdapter);
			if (!rowsUpdated) {
				toast.error('Что-то пошло не так при создании печатной формы');
			} else {
				toast.success('Печатная форма успешно создана');
			}
		} catch (err) {
			if (err instanceof RpcError) {
				err.toastMessage();
			} else {
				toast.error('Что-то пошло не так при создании печатной формы');
			}
		}
	},
);

export const updatePrintFormFx = createEffect(
	async (params: UpdatePrintFormParams) => {
		try {
			const { rowsUpdated } = await rpcQuery<
				ReturnType<typeof udpatePrintFormAdapter>
			>(updatePrintFormQuery(params), udpatePrintFormAdapter);
			if (!rowsUpdated) {
				toast.error('Что-то пошло не так при обновлении печатной формы');
			} else {
				toast.success('Печатная форма успешно обновлена');
			}
		} catch (err) {
			if (err instanceof RpcError) {
				err.toastMessage();
			} else {
				toast.error('Что-то пошло не так при обновлении печатной формы');
			}
		}
	},
);

export const fetchPrintFormPositionsFx = createEffect(
	async (params: FetchPrintFormPositionParams) => {
		try {
			const positions: PrintFormPosition[] = await rpcQuery<
				PrintFormPosition[]
			>(fetchPrintFormPositionsQuery(params), fetchPrintFormPositionsAdapter);
			return positions;
		} catch (err) {
			if (err instanceof RpcError) {
				err.toastMessage();
			} else {
				toast.error('Что-то пошло не так при получении позиций печатной формы');
			}
			return [];
		}
	},
);

export const fetchPrintFormTreeFx = createEffect(
	async (params: FetchPrintFormTreeParams) => {
		try {
			const tree = await rpcQuery<PrintFormTree[]>(
				fetchPrintFormTreeQuery(params),
				fetchPrintFormTreeAdapter,
			);
			return tree;
		} catch (err) {
			if (err instanceof RpcError) {
				err.toastMessage();
			} else {
				toast.error(
					'Что-то пошло не так при получении дерева отчетов печатной формы',
				);
			}
			return [];
		}
	},
);

export const deletePrintFormFx = createEffect(
	async (params: DeletePrintFormParams) => {
		try {
			const { rowsUpdated } = await rpcQuery<
				ReturnType<typeof deletePrintFormAdapter>
			>(deletePrintFormQuery(params), deletePrintFormAdapter);
			if (!rowsUpdated) {
				toast.error('Что-то пошло не так при удалении печатной формы');
			} else {
				toast.success('Печатная форма успешно удалена');
			}
			return rowsUpdated;
		} catch (err) {
			if (err instanceof RpcError) {
				err.toastMessage();
			} else {
				toast.error('Что-то пошло не так при удалении печатной формы');
			}
			return 0;
		}
	},
);

export const fetchPriorityMethodsFx = createEffect(async () => {
	try {
		const priorityMethods: PriorityMethod[] = await rpcQuery<PriorityMethod[]>(
			fetchPriorityMethodsQuery(),
			fetchPriorityMethodsAdapter,
		);
		return priorityMethods;
	} catch (err) {
		if (err instanceof RpcError) {
			err.toastMessage();
		} else {
			toast.error(
				'Что-то пошло не так при получении списка методов приоритета приборного учета',
			);
		}
		return [];
	}
});

export const movePrintFormPositionFx = createEffect(
	async (params: MovePrintFormPositionParams) => {
		try {
			const rowsUpdated: number = await rpcQuery<number>(
				movePrintFormPositionQuery(params),
				movePrintFormPositionAdapter,
			);
			if (rowsUpdated) {
				toast.success('Позиция успешно перемещена');
			}
			return rowsUpdated;
		} catch (err) {
			if (err instanceof RpcError) {
				err.toastMessage();
			} else {
				toast.error('Что-то пошло не так при перемещении позиции');
			}
			return 0;
		}
	},
);

export const createPrintFormPositionFx = createEffect(
	async (params: CreatePrintFormPositionParams) => {
		try {
			const rowsUpdated: number = await rpcQuery<number>(
				createPrintFormPositionQuery(params),
				createPrintFormPositionAdapter,
			);
			return rowsUpdated;
		} catch (err) {
			if (err instanceof RpcError) {
				err.toastMessage();
			} else {
				toast.error('Что-то пошло не так при создании позиции');
			}
			return 0;
		}
	},
);

export const deletePrintFormPositionFx = createEffect(
	async (params: DeletePrintFormPositionParams) => {
		try {
			const rowsUpdated: number = await rpcQuery<number>(
				deletePrintFormPositionQuery(params),
				deletePrintFormPositionAdapter,
			);
			return rowsUpdated;
		} catch (err) {
			if (err instanceof RpcError) {
				err.toastMessage();
			} else {
				toast.error('Что-то пошло не так при удалении позиции печатной формы');
			}
			return 0;
		}
	},
);

export const savePrintFormPositionSettingsFx = createEffect(
	async (params: SavePrintFormPositionSettingsParams) => {
		try {
			const rowsUpdated: number = await rpcQuery<number>(
				savePrintFormPositionSettingsQuery(params),
				savePrintFormPositionSettingsAdapter,
			);
			if (rowsUpdated) {
				toast.success('Настройки позиции сохранены');
			}
			return rowsUpdated;
		} catch (err) {
			if (err instanceof RpcError) {
				err.toastMessage();
			} else {
				toast.error('Что-то пошло не так при сохранении настроек позиции');
			}
		}
	},
);

export const unsyncPrintFormPositionFx = createEffect(
	async (params: UnsyncPrintFormPositionParams) => {
		try {
			const rowsUpdated: number = await rpcQuery<number>(
				unsyncPrintFormPositionQuery(params),
				unsyncPrintFormPositionAdapter,
			);

			return rowsUpdated;
		} catch (err) {
			if (err instanceof RpcError) {
				err.toastMessage();
			} else {
				toast.error(
					'Что-то пошло не так при попытке отвязать узел от позиции отчета',
				);
			}
			return 0;
		}
	},
);
export const syncPrintFormPositionFx = createEffect(
	async (params: SyncPrintFormPositionParams) => {
		try {
			const rowsUpdated: number = await rpcQuery<number>(
				syncPrintFormPositionQuery(params),
				syncPrintFormPositionAdapter,
			);

			return rowsUpdated;
		} catch (err) {
			if (err instanceof RpcError) {
				err.toastMessage();
			} else {
				toast.error(
					'Что-то пошло не так при попытке привязать узел к позиции отчета',
				);
			}
			return 0;
		}
	},
);
export const fetchPrintFormParametersFx = createEffect(
	async (params: FetchPrintFormParametersParams) => {
		try {
			const printFormParameters: PrintFormParameter[] = await rpcQuery<
				PrintFormParameter[]
			>(fetchPrintFormParametersQuery(params), fetchPrintFormParametersAdapter);

			return printFormParameters;
		} catch (err) {
			if (err instanceof RpcError) {
				err.toastMessage();
			} else {
				toast.error('Что-то пошло не так при получении параметров формы');
			}
			return [];
		}
	},
);
export const fetchNotSyncedPrintFormParametersFx = createEffect(
	async (params: FetchPrintFormParametersParams) => {
		try {
			const printFormParameters: PrintFormParameterNotSynced[] = await rpcQuery<
				PrintFormParameterNotSynced[]
			>(
				fetchNotSyncedPrintFormParametersQuery(params),
				fetchNotSyncedPrintFormParametersAdapter,
			);

			return printFormParameters;
		} catch (err) {
			if (err instanceof RpcError) {
				err.toastMessage();
			} else {
				toast.error(
					'Что-то пошло не так при получении параметров, не привязанных к форме',
				);
			}
			return [];
		}
	},
);
export const syncPrintFormParameterFx = createEffect(
	async (params: SyncPrintFormParametersParams) => {
		try {
			const linkId: number = await rpcQuery<number>(
				syncPrintFormParameterQuery(params),
				syncPrintFormParameterAdapter,
			);
			return linkId;
		} catch (err) {
			if (err instanceof RpcError) {
				err.toastMessage();
			} else {
				toast.error('Что-то пошло не так при привязке параметра формы');
			}
			return 0;
		}
	},
);
export const unsyncPrintFormParameterFx = createEffect(
	async (params: CommonPrintFormParametersParams) => {
		try {
			await rpcQuery<number>(unsyncPrintFormParameterQuery(params));
		} catch (err) {
			if (err instanceof RpcError) {
				err.toastMessage();
			} else {
				toast.error('Что-то пошло не так при отвязке параметра формы');
			}
		}
	},
);
export const fetchPrintFormParameterValuesFx = createEffect(
	async (params: CommonPrintFormParametersParams) => {
		try {
			const parameterValues: PrintFormParameterValue[] = await rpcQuery<
				PrintFormParameterValue[]
			>(
				fetchPrintFormParameterValuesQuery(params),
				fetchPrintFormParameterValuesAdapter,
			);

			return parameterValues;
		} catch (err) {
			if (err instanceof RpcError) {
				err.toastMessage();
			} else {
				toast.error(
					'Что-то пошло не так при получении списка значений параметра формы',
				);
			}
			return [];
		}
	},
);
export const addPrintFormParameterValueFx = createEffect(
	async (params: AddParameterValuePrintFormParams) => {
		try {
			await rpcQuery<void>(addPrintFormParameterValueQuery(params));
		} catch (err) {
			if (err instanceof RpcError) {
				err.toastMessage();
			} else {
				toast.error(
					'Что-то пошло не так при добавлении значения для параметра формы',
				);
			}
		}
	},
);
export const updatePrintFormParameterValueFx = createEffect(
	async (params: AddParameterValuePrintFormParams) => {
		try {
			await rpcQuery<void>(updatePrintFormParameterValueQuery(params));
		} catch (err) {
			if (err instanceof RpcError) {
				err.toastMessage();
			} else {
				toast.error(
					'Что-то пошло не так при изменении значения для параметра формы',
				);
			}
		}
	},
);
export const deletePrintFormParameterValueFx = createEffect(
	async (params: CommonPrintFormParametersParams) => {
		try {
			await rpcQuery<void>(deletePrintFormParameterValueQuery(params));
		} catch (err) {
			if (err instanceof RpcError) {
				err.toastMessage();
			} else {
				toast.error(
					'Что-то пошло не так при удалении значения для параметра формы',
				);
			}
		}
	},
);
