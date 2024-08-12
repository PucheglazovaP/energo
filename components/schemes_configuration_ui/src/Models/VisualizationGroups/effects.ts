import { toast } from 'react-toastify';
import { createEffect } from 'effector';

import { getVisualizationGroupsAdapter } from '../../Adapters/VisualizationGroupsTable/getVisualizationGroupsAdapter';
import { visualizationGroupAdapter } from '../../Adapters/VisualizationGroupsTable/visualizationGroupAdapter';
import {
	deleteVisualizationGroupQuery,
	getVisualizationGroupsListQuery,
	moveVisualizationGroupOrderQuery,
} from '../../Const/Queries/visualizationGroupsTable';
import { RpcError, rpcQuery } from '../../Utils/requests';

import { setVisualizationGroupsIsLoading } from './events';
import {
	DeleteVisualizationGroupParams,
	MoveVisualizationGroupSortOrder,
	VisualizationGroupList,
	VisualizationGroupsListParams,
} from './types';

// Получение списка групп визуализации
export const fetchVisualizationGroupsListFx = createEffect(
	async (params: VisualizationGroupsListParams) => {
		try {
			setVisualizationGroupsIsLoading(true);
			const visualizationGroupsList: VisualizationGroupList[] = await rpcQuery<
				VisualizationGroupList[]
			>(getVisualizationGroupsListQuery(params), getVisualizationGroupsAdapter);

			return visualizationGroupsList;
		} catch (err) {
			if (err instanceof RpcError) {
				err.toastMessage();
			} else {
				toast.error(
					'Что-то пошло не так при получении списка групп визуализации',
				);
			}
			setVisualizationGroupsIsLoading(false);
			return [];
		}
	},
);

// Удаление группы
export const deleteVisualizationGroupFx = createEffect(
	async (params: DeleteVisualizationGroupParams) => {
		try {
			const group = await rpcQuery<number>(
				deleteVisualizationGroupQuery(params),
				visualizationGroupAdapter,
			);
			toast.success('Группа визуализации успешно удалена');
			return group;
		} catch (err) {
			if (err instanceof RpcError) {
				err.toastMessage();
			} else {
				toast.error('Что-то пошло не так c удалением группы визуализации');
			}

			return false;
		}
	},
);

// Поменять порядок групп визуализации в таблице (для днд)
export const moveVisualizationGroupSortOrderFx = createEffect(
	async (params: MoveVisualizationGroupSortOrder) => {
		try {
			const movedData = await rpcQuery<number>(
				moveVisualizationGroupOrderQuery(params),
				visualizationGroupAdapter,
			);
			toast.success('Группа успешно перемещена');

			return movedData;
		} catch (err) {
			if (err instanceof RpcError) {
				err.toastMessage();
			} else {
				toast.error('Что-то пошло не так c перемещением группы');
			}

			return 0;
		}
	},
);
