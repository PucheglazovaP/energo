import { createStore, sample } from 'effector';

import { Accessors } from '../../Containers/ParameterByValueTable/types';
import { SortOptions, SortOrder, User } from '../../Shared/types';
import { ModuleName } from '../../Shared/Types/moduleName';
import { $user } from '../Auth';
import { saveVisualizationGroupFx } from '../EditVisualizationGroupForm/effects';
import { $energyResourceId } from '../EnergyResources';

import {
	deleteVisualizationGroupFx,
	fetchVisualizationGroupsListFx,
	moveVisualizationGroupSortOrderFx,
} from './effects';
import {
	setActiveVisualizationGroupIdEvent,
	setCurrentVisualizationGroupIdEvent,
	setVisualizationGroupsIsLoading,
	setVisualizationGroupsListEvent,
	setVisualizationGroupsSortFilterEvent,
} from './events';
import { VisualizationGroupsTable } from './types';

const INITIAL_VISUALIZATION_GROUPS = {
	visualizationGroups: [],
	isLoading: true,
	activeVisualizationGroupId: null,
	currentVisualizationGroupId: 0,
};

// модель "Группы визуализации"
export const $visualizationGroupsTable = createStore<VisualizationGroupsTable>(
	INITIAL_VISUALIZATION_GROUPS,
);

$visualizationGroupsTable
	// установка списка групп визуализации
	.on(setVisualizationGroupsListEvent, (state, visualizationGroups) => {
		return {
			...state,
			visualizationGroups,
		};
	})
	// смена флага загрузки списка групп визуализации
	.on(setVisualizationGroupsIsLoading, (state, isLoading) => {
		return {
			...state,
			isLoading,
		};
	})
	// отслеживание загрузки списка групп визуализации
	.on(fetchVisualizationGroupsListFx.doneData, (state) => {
		return { ...state, isLoading: false };
	})
	// выбор активной группы визуализации
	.on(
		setActiveVisualizationGroupIdEvent,
		(state, activeVisualizationGroupId) => ({
			...state,
			activeVisualizationGroupId,
		}),
	)
	// получение ид группы визуализации при вызове контекстного меню
	.on(
		setCurrentVisualizationGroupIdEvent,
		(state, currentVisualizationGroupId) => ({
			...state,
			currentVisualizationGroupId,
		}),
	);

// стор сортировки таблицы
export const $visualizationGroupsSortFilter = createStore<SortOptions>({
	accessor: '' as Accessors,
	order: SortOrder.None,
});

$visualizationGroupsSortFilter.on(
	setVisualizationGroupsSortFilterEvent,
	(_state, sortFilter) => {
		return {
			...sortFilter,
		};
	},
);

/* ------------------------------------------ samples ------------------------------------------ */

// отслеживание отправки запроса на загрузку списка групп визуализации
sample({
	clock: fetchVisualizationGroupsListFx.doneData,
	target: setVisualizationGroupsListEvent,
});

/* Отслеживание обновления порядка строк в таблице при их перемещении
и подгрузка обновленного списка групп визуализации */
sample({
	clock: moveVisualizationGroupSortOrderFx.doneData,
	source: [$energyResourceId, $user],
	fn: (src) => {
		const [energyResourceId, user] = src as [number, User];
		return {
			energyResourceId,
			userId: user.preferredUsername,
			moduleName:
				ModuleName.MoveVisualizationGroupSortOrderFx_sample_fetchVisualizationGroupsListFx,
		};
	},
	target: fetchVisualizationGroupsListFx,
});

/* Отслеживание обновления групп визуализации при сохранении/добавлении новой группы
и подгрузка обновленного списка групп визуализации */
sample({
	clock: saveVisualizationGroupFx.doneData,
	source: [$energyResourceId, $user],
	fn: (src) => {
		const [energyResourceId, user] = src as [number, User];
		return {
			energyResourceId,
			userId: user.preferredUsername,
			moduleName:
				ModuleName.SaveVisualizationGroupFx_sample_fetchVisualizationGroupsListFx,
		};
	},
	target: fetchVisualizationGroupsListFx,
});

/* Отслеживание обновления групп визуализации при удаления новой группы
и подгрузка обновленного списка групп визуализации */
sample({
	clock: deleteVisualizationGroupFx.doneData,
	source: [$energyResourceId, $user],
	fn: (src) => {
		const [energyResourceId, user] = src as [number, User];
		return {
			energyResourceId,
			userId: user.preferredUsername,
			moduleName:
				ModuleName.DeleteVisualizationGroupFx_sample_fetchVisualizationGroupsListFx,
		};
	},
	target: fetchVisualizationGroupsListFx,
});
