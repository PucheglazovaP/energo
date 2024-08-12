import { toast } from 'react-toastify';
import { createEffect } from 'effector';

import { deleteParameterAdapter } from '../../Adapters/ParameterByValueTable/deleteParameterAdapter';
import { moveParameterOrderAdapter } from '../../Adapters/ParameterByValueTable/moveParameterOrderAdapter';
import { getParametersByValueListAdapter } from '../../Adapters/ParameterByValueTable/parameterByValueListAdapter';
import {
	deleteParameterQuery,
	getParameterByValueListQuery,
	moveParameterOrderQuery,
} from '../../Const/Queries/parameterByValueTable';
import { RpcError, rpcQuery } from '../../Utils/requests';

import { setParametersIsLoading } from './events';
import {
	DeleteParameterParams,
	MoveParameterSortOrder,
	ParameterByValueListParams,
	ParametersByValueList,
} from './types';

// Получение списка показателей отчетов
export const getParametersByValueListFx = createEffect(
	async (params: ParameterByValueListParams) => {
		try {
			setParametersIsLoading(true);
			const parameterByValueList: ParametersByValueList[] = await rpcQuery<
				ParametersByValueList[]
			>(getParameterByValueListQuery(params), getParametersByValueListAdapter);

			return parameterByValueList;
		} catch (err) {
			if (err instanceof RpcError) {
				err.toastMessage();
			} else {
				toast.error('Что-то пошло не так при получении списка параметров');
			}
			setParametersIsLoading(false);
			return [];
		}
	},
);

// Удаление параметра
export const deleteParameterFx = createEffect(
	async (params: DeleteParameterParams) => {
		try {
			const parameter = await rpcQuery<number>(
				deleteParameterQuery(params),
				deleteParameterAdapter,
			);
			toast.success('Параметр успешно удален');
			return parameter;
		} catch (err) {
			if (err instanceof RpcError) {
				err.toastMessage();
			} else {
				toast.error('Что-то пошло не так c удалением параметра');
			}

			return false;
		}
	},
);

// Поменять порядок параметров в таблице (для днд)
export const moveParametersSortOrderFx = createEffect(
	async (params: MoveParameterSortOrder) => {
		try {
			const movedData = await rpcQuery<number>(
				moveParameterOrderQuery(params),
				moveParameterOrderAdapter,
			);
			toast.success('Параметр успешно перемещен');

			return movedData;
		} catch (err) {
			if (err instanceof RpcError) {
				err.toastMessage();
			} else {
				toast.error('Что-то пошло не так c перемещением параметра');
			}

			return 0;
		}
	},
);
