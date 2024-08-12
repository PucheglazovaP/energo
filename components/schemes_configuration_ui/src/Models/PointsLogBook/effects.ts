import { toast } from 'react-toastify';
import { createEffect } from 'effector';

import { fetchPointLogBookBodyListAdapter } from '../../Adapters/PointLogBook/fetchPointLogBookBodyListAdapter';
import { fetchPointLogBookHeaderListAdapter } from '../../Adapters/PointLogBook/fetchPointLogBookHeaderListAdapter';
import { savePointLogBookValueAdapter } from '../../Adapters/PointLogBook/savePointLogBookValueAdapter';
import {
	fetchPointLogBookBodyListQuery,
	fetchPointLogBookHeaderListQuery,
	savePointLogBookValueQuery,
} from '../../Const/Queries/pointLogBook';
import { RpcError, rpcQuery } from '../../Utils/requests';
import { InputFormHeader } from '../InputFormHeader/types';

import { setPointLogBookIsLoadingEvent } from './events';
import {
	PointLogBookBodyList,
	PointLogBookBodyListParams,
	PointLogBookHeaderListParams,
	SavePointLogBookValueParams,
} from './types';

// Получение заголовка журнала учёта для базовой точки
export const fetchPointLogBookHeaderListFx = createEffect(
	async (params: PointLogBookHeaderListParams) => {
		try {
			setPointLogBookIsLoadingEvent(true);
			const pointLogBookHeader: InputFormHeader[] = await rpcQuery<
				InputFormHeader[]
			>(
				fetchPointLogBookHeaderListQuery(params),
				fetchPointLogBookHeaderListAdapter,
			);

			return pointLogBookHeader;
		} catch (err) {
			if (err instanceof RpcError) {
				err.toastMessage();
			} else {
				toast.error(
					'Что-то пошло не так при получении заголовка журнала учёта для базовой точки',
				);
			}
			setPointLogBookIsLoadingEvent(false);

			return [];
		}
	},
);

// Получение журнала учёта для базовой точки
export const fetchPointLogBookBodyListFx = createEffect(
	async (params: PointLogBookBodyListParams) => {
		try {
			setPointLogBookIsLoadingEvent(true);
			const pointLogBookBody: PointLogBookBodyList[] = await rpcQuery<
				PointLogBookBodyList[]
			>(
				fetchPointLogBookBodyListQuery(params),
				fetchPointLogBookBodyListAdapter,
			);

			return pointLogBookBody;
		} catch (err) {
			if (err instanceof RpcError) {
				err.toastMessage();
			} else {
				toast.error(
					'Что-то пошло не так при получении журнала учёта для базовой точки',
				);
			}
			setPointLogBookIsLoadingEvent(false);

			return [];
		}
	},
);

// Сохранение значения в таблице журнала учёта для базовой точки
export const savePointLogBookValueFx = createEffect(
	async (params: SavePointLogBookValueParams) => {
		const updatedPointLogBookBodyRow: PointLogBookBodyList[] = await rpcQuery<
			PointLogBookBodyList[]
		>(savePointLogBookValueQuery(params), savePointLogBookValueAdapter);

		return updatedPointLogBookBodyRow;
	},
);
