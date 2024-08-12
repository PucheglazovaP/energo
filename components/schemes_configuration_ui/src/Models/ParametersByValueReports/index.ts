import { createStore, sample } from 'effector';

import { SearchFilters, User } from '../../Shared/types';
import { ModuleName } from '../../Shared/Types/moduleName';
import { $user } from '../Auth';
import { $energyResourceId } from '../EnergyResources';
import { fetchEnergyResourcesListFx } from '../EnergyResources/effects';
import { setEnergyResourcesList } from '../EnergyResources/events';
import { moveVisualizationGroupSortOrderFx } from '../VisualizationGroups/effects';

import {
	deleteParameterFx,
	getParametersByValueListFx,
	moveParametersSortOrderFx,
} from './effects';
import {
	setModalLinkedPointIdEvent,
	setParametersByValueListEvent,
	setParametersIsLoading,
	setParameterTypeOptionsEvent,
	setSelectedParameterTypesEvent,
	setTableSearchFiltersEvent,
	setTableSortFilterEvent,
	setToggledSections,
} from './events';
import { ParameterByValueTable } from './types';

export const initialSearchFiltersStore: SearchFilters = {
	shortName: '',
	name: '',
	pointName: '',
};

const initialStore = {
	parametersList: [],
	searchFilters: initialSearchFiltersStore,
	isLoading: true,
	parametersTypeOptions: [
		{ name: 'Да', key: '1', isChecked: true },
		{ name: 'Нет', key: '2', isChecked: true },
	],
	selectedParameterTypes: [],
	modalLinkedPointId: 0,
	toggledSections: [],
};

// Модель "Параметры приборных и вычисляемых величин"
export const $parameterByValueTable =
	createStore<ParameterByValueTable>(initialStore);

$parameterByValueTable
	// Установка Список приборов для отчетов
	.on(setParametersByValueListEvent, (state, parametersList) => {
		return {
			...state,
			parametersList,
		};
	})
	// Установка стейта фильтра сортировки таблицы приборов
	.on(setTableSortFilterEvent, (state, sortFilter) => {
		return {
			...state,
			sortFilter,
		};
	})
	// Установка стейта фильтра поиска таблицы приборов
	.on(setTableSearchFiltersEvent, (state, searchFilters) => {
		return {
			...state,
			searchFilters,
		};
	})
	// Смена флага загрузки приборов
	.on(setParametersIsLoading, (state, isLoading) => {
		return {
			...state,
			isLoading,
		};
	})
	// Отслеживание загрузки приборов
	.on(getParametersByValueListFx.doneData, (state) => {
		return { ...state, isLoading: false };
	})
	// Изменение набора опций фильтра в колонке "Связ. параметр"
	.on(setParameterTypeOptionsEvent, (state, parametersTypeOptions) => ({
		...state,
		parametersTypeOptions,
	}))
	// Изменение набора выбранных опций в фильтре в колонке "Связ. параметр"
	.on(setSelectedParameterTypesEvent, (state, selectedParameterTypes) => ({
		...state,
		selectedParameterTypes,
	}))
	// Изменение номера связанной точки учета для модального окна
	.on(setModalLinkedPointIdEvent, (state, modalLinkedPointId) => ({
		...state,
		modalLinkedPointId,
	}))
	// Изменение состояния свёрнутых секции в таблице
	.on(setToggledSections, (state, toggledSections) => {
		return {
			...state,
			toggledSections,
		};
	});

/* ------------------------------------------ samples ------------------------------------------ */

// Отслеживание отправки запроса на загрузку списка показателей отчетов
sample({
	clock: getParametersByValueListFx.doneData,
	target: setParametersByValueListEvent,
});

// Отслеживание отправки запроса на загрузку списка энергоресурсов
sample({
	clock: fetchEnergyResourcesListFx.doneData,
	target: setEnergyResourcesList,
});

/* Отслеживание обновления порядка строк в таблице при их перемещении
и подгрузка обновленного списка параметров */
sample({
	clock: moveParametersSortOrderFx.doneData,
	source: [$energyResourceId, $user],
	fn: (src) => {
		const [energyResourceId, user] = src as [number, User];
		return {
			energyResourceId,
			userId: user.preferredUsername,
			moduleName:
				ModuleName.MoveParametersSortOrderFx_sample_getParametersByValueListFx,
		};
	},
	target: getParametersByValueListFx,
});

/* Отслеживание обновления порядка строк в таблице при их перемещении
и подгрузка обновленного списка параметров */
sample({
	clock: deleteParameterFx.doneData,
	source: [$energyResourceId, $user],
	fn: (src) => {
		const [energyResourceId, user] = src as [number, User];
		return {
			energyResourceId,
			userId: user.preferredUsername,
			moduleName:
				ModuleName.DeleteParameterFx_sample_getParametersByValueListFx,
		};
	},
	target: getParametersByValueListFx,
});

/* Отслеживание обновления порядка строк в таблице при перемещении групп
и подгрузка обновленного списка параметров */
sample({
	clock: moveVisualizationGroupSortOrderFx.doneData,
	source: [$energyResourceId, $user],
	fn: (src) => {
		const [energyResourceId, user] = src as [number, User];
		return {
			energyResourceId,
			userId: user.preferredUsername,
			moduleName:
				ModuleName.MoveVisualizationGroupSortOrderFx_sample_getParametersByValueListFx,
		};
	},
	target: getParametersByValueListFx,
});
