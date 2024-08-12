import { createStore, sample } from 'effector';

import { SortOptions, SortOrder, User } from '../../Shared/types';
import { ModuleName } from '../../Shared/Types/moduleName';
import { $user } from '../Auth';
import { $energyResourceId } from '../EnergyResources';
import { fetchEnergyResourcesListFx } from '../EnergyResources/effects';
import {
	changeEnergyResource,
	setEnergyResourcesList,
} from '../EnergyResources/events';

import {
	addPointChannelFx,
	deletePointChannelFx,
	deletePointFx,
	editPointChannelFx,
	fetchPointChannelsListFx,
	fetchPointsListFx,
	movePointsSortOrderFx,
	savePointFx,
} from './effects';
import {
	changeIsActivePointEvent,
	movePoints,
	onCollapse,
	setContextMenuIdEvent,
	setEditPointData,
	setFocusPointId,
	setPointChannels,
	setPointsList,
	setPointsTableSortFilterEvent,
	updatePointCoefficient,
} from './events';
import { Accessors, EditPointParams, FocusOnPoint, Point } from './types';

export const INITIAL_EDIT_POINT = {
	name: '',
	shortName: '',
	comment: '',
	captionName: '',
	linkedPointId: null,
	linkedPointName: null,
	linkedPointRatio: null,
	linkedPointComment: null,
	energyResource: 0,
	lastModified: '',
	userId: '',
	moduleName: ModuleName.Sample_INITIAL_EDIT_POINT,
};

export const $points = createStore<Point[]>([]);

$points
	.on(setPointsList, (_state, data) => {
		return data;
	})
	.on(setPointChannels, (state, data) => {
		const points = state.map((point) => {
			const channel = data.find((pointChannel) => pointChannel.pointId) || {
				pointId: 0,
			};
			return point.id === channel.pointId
				? { ...point, channels: data }
				: point;
		});
		return [...points];
	})
	.on(onCollapse, (state, data) => {
		return state.map((point) => {
			return point.id === data.id
				? { ...point, isCollapsed: !point.isCollapsed }
				: point;
		});
	})
	.on(changeIsActivePointEvent, (state, activePoint) => {
		return state.map((point) =>
			point.id === activePoint.id
				? { ...point, isActive: activePoint.isActive }
				: point,
		);
	})
	.on(updatePointCoefficient, (state, data) => {
		return state.map((point) =>
			point.id === data.pointId
				? { ...point, coefficient: data.coefficient }
				: point,
		);
	});

// Отслеживание отправки запроса на загрузку базовых точек учета
sample({
	clock: fetchPointsListFx.doneData,
	target: setPointsList,
});

// Стор сортировки таблицы
export const $pointsSortFilter = createStore<SortOptions>({
	accessor: '' as Accessors,
	order: SortOrder.None,
});

$pointsSortFilter.on(setPointsTableSortFilterEvent, (_state, sortFilter) => {
	return {
		...sortFilter,
	};
});

// id точки для вызова контекстного меню
export const $contextMenuId = createStore<number>(0);
$contextMenuId.on(setContextMenuIdEvent, (_state, payload) => payload);

export const $editPointData = createStore<EditPointParams>(INITIAL_EDIT_POINT);

$editPointData.on(setEditPointData, (_state, payload) => payload);

// Необходимость скрола к базовой точке при переходе с другой страницы
export const $focusOnPoint = createStore<FocusOnPoint>({ focusPointId: null });

$focusOnPoint.on(setFocusPointId, (state, focusPointId) => ({
	...state,
	focusPointId,
}));

/* ------------------------------------------ samples ------------------------------------------ */

// Отслеживание отправки запроса на загрузку энергоресурсов
sample({
	clock: fetchEnergyResourcesListFx.doneData,
	target: setEnergyResourcesList,
});

// Запрос базовых точек учета после выбора энергоресурса
sample({
	clock: changeEnergyResource,
	source: [$energyResourceId, $user],
	fn: (data) => {
		const [energyResourceId, user] = data as [number, User | null];
		return {
			energyResource: energyResourceId,
			userId: String(user?.preferredUsername),
			moduleName: ModuleName.ChangeEnergyResource_sample_fetchPointsListFx,
		};
	},
	target: fetchPointsListFx,
});

// Отслеживание отправки запроса на загрузку каналов и приборов для выбранной точки
sample({
	clock: fetchPointChannelsListFx.doneData,
	target: setPointChannels,
});

// Запрос на получение каналов и приборов при открытии аккордеона в таблице
sample({
	clock: onCollapse,
	fn: (point) => {
		return {
			point: point.id,
			userId: point.userId,
			moduleName: ModuleName.OnCollapse_sample_fetchPointsListFx,
		};
	},
	target: fetchPointChannelsListFx,
});

// Вызов запроса по изменению порядка точек в таблице
sample({
	clock: movePoints,
	target: movePointsSortOrderFx,
});

sample({
	clock: [
		movePointsSortOrderFx.doneData,
		savePointFx.doneData,
		deletePointFx.doneData,
		addPointChannelFx.doneData,
	],
	source: [$energyResourceId, $user],
	fn: (data) => {
		const [energyResourceId, user] = data as [number, User | null];
		return {
			energyResource: energyResourceId,
			userId: String(user?.preferredUsername),
			moduleName:
				ModuleName.Move_save_deletePoints_addPointChannel_sample_fetchPointsListFx,
		};
	},
	target: fetchPointsListFx,
});

sample({
	clock: [
		addPointChannelFx.doneData,
		editPointChannelFx.doneData,
		deletePointChannelFx.doneData,
	],
	source: [$contextMenuId, $user],
	fn: (data) => {
		const [point, user] = data as [number, User | null];
		return {
			point,
			userId: user?.preferredUsername ?? '',
			moduleName:
				ModuleName.Add_edit_deletePointChannel_sample_fetchPointChannelsListFx,
		};
	},
	target: fetchPointChannelsListFx,
});
