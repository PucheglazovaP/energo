import { toast } from 'react-toastify';
import { createEffect } from 'effector';

import { moveObjectAdapter } from '../../Adapters/moveObjectAdapter';
import { channelsAdapter } from '../../Adapters/Points/channelsAdapter';
import { pointAdapter } from '../../Adapters/Points/pointAdapter';
import { pointsAdapter } from '../../Adapters/Points/ugeReportsAdapter';
import {
	addPointChannelQuery,
	createPointQuery,
	deletePointChannelQuery,
	deletePointQuery,
	editPointChannelQuery,
	getChannelsQuery,
	getPointsQuery,
	movePointsOrderQuery,
	updatePointQuery,
} from '../../Const/Queries/points';
import { handleError } from '../../Utils/handleToast';
import { RpcError, rpcQuery } from '../../Utils/requests';

import {
	CreatePointChannelParams,
	DeleteParams,
	EditPointChannelParams,
	EditPointParams,
	GetPointsAction,
	MovePointsSortOrder,
	Point,
	PointChannel,
	PointChannelsListParams,
} from './types';

// Запрос базовых точек учета для отображения таблицы
export const fetchPointsListFx = createEffect(
	async (getPointsParams: GetPointsAction) => {
		const points = await rpcQuery<Point[]>(
			getPointsQuery(getPointsParams),
			pointsAdapter,
		);
		return points;
	},
);

fetchPointsListFx.fail.watch(({ error }) => {
	handleError(error);
});

// Запрос подключенных каналов и приборов выбранной точки
export const fetchPointChannelsListFx = createEffect(
	async (params: PointChannelsListParams) => {
		const energyResources = await rpcQuery<PointChannel[]>(
			getChannelsQuery(params),
			channelsAdapter,
		);
		return energyResources;
	},
);

fetchPointChannelsListFx.fail.watch(({ error }) => {
	handleError(error);
});

// Поменять порядок точек в таблице
export const movePointsSortOrderFx = createEffect(
	async (params: MovePointsSortOrder) => {
		const movedData = await rpcQuery<string>(
			movePointsOrderQuery(params),
			moveObjectAdapter,
		);
		return movedData;
	},
);

movePointsSortOrderFx.fail.watch(({ error }) => {
	handleError(error);
});

// Создание и редактирование базовой точки
export const savePointFx = createEffect(async (data: EditPointParams) => {
	try {
		const point = await rpcQuery<number>(
			data.id ? updatePointQuery(data) : createPointQuery(data),
			pointAdapter,
		);
		toast.success(`Точка успешно ${data.id ? 'изменена' : 'добавлена'}`);
		return point;
	} catch (err) {
		if (err instanceof RpcError) {
			err.toastMessage();
		} else {
			toast.error('Что-то пошло не так c обновлением базовой точки');
		}

		return false;
	}
});

export const deletePointFx = createEffect(async (data: DeleteParams) => {
	try {
		const point = await rpcQuery<number>(deletePointQuery(data), pointAdapter);
		toast.success('Точка успешно удалена');
		return point;
	} catch (err) {
		if (err instanceof RpcError) {
			err.toastMessage();
		} else {
			toast.error('Что-то пошло не так c удалением базовой точки');
		}

		return false;
	}
});

// связывание канала с точкой
export const addPointChannelFx = createEffect(
	async (data: CreatePointChannelParams) => {
		try {
			const channel = await rpcQuery<number>(
				addPointChannelQuery(data),
				pointAdapter,
			);
			toast.success(`Канал успешно добавлен`);
			return channel;
		} catch (err) {
			if (err instanceof RpcError) {
				err.toastMessage();
			} else {
				toast.error('Что-то пошло не так c добавлением канала');
			}

			return 0;
		}
	},
);

export const editPointChannelFx = createEffect(
	async (data: EditPointChannelParams) => {
		try {
			const channel = await rpcQuery<number>(
				editPointChannelQuery(data),
				pointAdapter,
			);
			toast.success(`Канал успешно отредактирован`);
			return channel;
		} catch (err) {
			if (err instanceof RpcError) {
				err.toastMessage();
			} else {
				toast.error('Что-то пошло не так c редактированием канала');
			}

			return 0;
		}
	},
);

export const deletePointChannelFx = createEffect(async (data: DeleteParams) => {
	try {
		const channel = await rpcQuery<number>(
			deletePointChannelQuery(data),
			pointAdapter,
		);
		toast.success(`Канал успешно удален`);
		return channel;
	} catch (err) {
		if (err instanceof RpcError) {
			err.toastMessage();
		} else {
			toast.error('Что-то пошло не так c удалением канала');
		}

		return 0;
	}
});
