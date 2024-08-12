import { toast } from 'react-toastify';
import { createEffect } from 'effector';

import { visualizationGroupAdapter } from '../../Adapters/VisualizationGroupsTable/visualizationGroupAdapter';
import {
	addVisualizationGroupQuery,
	editVisualizationGroupQuery,
} from '../../Const/Queries/editVisualizationGroupForm';
import { RpcError, rpcQuery } from '../../Utils/requests';

import { EditVisualizationGroupParams } from './types';

// Изменение или добавление группы визуализации
export const saveVisualizationGroupFx = createEffect(
	async (params: EditVisualizationGroupParams) => {
		try {
			const group = await rpcQuery<number>(
				params.visualizationGroupId
					? editVisualizationGroupQuery(params)
					: addVisualizationGroupQuery(params),
				visualizationGroupAdapter,
			);
			toast.success(
				`Группа визуализации успешно ${
					params.visualizationGroupId ? 'изменена' : 'добавлена'
				}`,
			);

			return group;
		} catch (err) {
			if (err instanceof RpcError) {
				err.toastMessage();
			} else {
				toast.error(
					`Что-то пошло не так c ${
						params.visualizationGroupId ? 'изменением' : 'добавлением'
					} группы визуализации`,
				);
			}

			return 0;
		}
	},
);
