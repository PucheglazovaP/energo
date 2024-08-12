import { createStore, sample } from 'effector';

import { DevicesReportTitle } from '../../Containers/DeviceReports/types';
import { Accessors } from '../../Containers/ReportTable/types';
import { getFilterOptionsByDeviceType } from '../../Containers/ReportTable/utils';
import {
	DeviceParams,
	SearchFilters,
	SortOptions,
	SortOrder,
} from '../../Shared/types';

import {
	getDeviceParametersFx,
	getDeviceReportsFx,
	getDevicesListFx,
	updateDeviceParameterFx,
} from './effects';
import {
	setActiveDeviceIdEvent,
	setChangeTypeEvent,
	setDeviceParametersEvent,
	setDeviceReportsEvent,
	setDevicesIsLoading,
	setDevicesListEvent,
	setDeviceTypeOptionsEvent,
	setEditModeEvent,
	setSelectedDeviceTypesEvent,
	setTableSearchFiltersEvent,
	setTableSortFilterEvent,
	updateDeviceParameterEvent,
} from './events';
import { DeviceParameter, DeviceReports, DeviceReportsTypes } from './types';

const initialReportTypesStore: DeviceReportsTypes[] = [
	{
		id: '1',
		isChecked: true,
		title: DevicesReportTitle.DevicesStatements,
	},
	{
		id: '2',
		isChecked: false,
		title: DevicesReportTitle.EmergencyLog,
	},
	{
		id: '3',
		isChecked: false,
		title: DevicesReportTitle.FailuresLog,
	},
];

export const initialSortFilterStore: SortOptions = {
	accessor: '' as Accessors,
	order: SortOrder.None,
};

export const initialSearchFiltersStore: SearchFilters = {
	interface: '',
	accounting: '',
};

const initialStore = {
	isEditMode: false,
	reportTypes: initialReportTypesStore,
	deviceParameters: [],
	activeDeviceId: 0,
	deviceReports: [],
	devicesList: [],
	sortFilter: initialSortFilterStore,
	searchFilters: initialSearchFiltersStore,
	isLoading: false,
	deviceTypeOptions: [],
	selectedDeviceTypes: [],
};

export const $deviceReports = createStore<DeviceReports>(initialStore);

// Включение/выключение режима редактирования параметров прибора
$deviceReports
	.on(setEditModeEvent, (state, mode) => ({
		...state,
		isEditMode: mode,
	}))
	// Изменение активного прибора в таблице
	.on(setActiveDeviceIdEvent, (state, deviceNumber) => ({
		...state,
		activeDeviceId: deviceNumber,
	}))
	// Изменение набора опций фильтра в колонке "Тип прибора"
	.on(setDeviceTypeOptionsEvent, (state, deviceTypeOptions) => ({
		...state,
		deviceTypeOptions,
	}))
	// Изменение набора выбранных имен приборов в фильтре в колонке "Тип прибора"
	.on(setSelectedDeviceTypesEvent, (state, selectedDeviceTypes) => ({
		...state,
		selectedDeviceTypes,
	}))
	// Изменение активного типа отчетов
	.on(setChangeTypeEvent, (state, id) => {
		const selectedTypeIdx = state.reportTypes.findIndex((t) => t.id === id);

		if (selectedTypeIdx === -1) {
			return state;
		}

		const newTypes = state.reportTypes.map((item) => ({
			...item,
			isChecked: false,
		}));
		newTypes[selectedTypeIdx].isChecked = true;

		return {
			...state,
			reportTypes: newTypes,
		};
	})
	// Установка параметров прибора
	.on(setDeviceParametersEvent, (state, parameters) => {
		return {
			...state,
			deviceParameters: parameters,
		};
	})
	// Изменение значения параметра прибора
	.on(updateDeviceParameterEvent, (state, parameter) => {
		const parameterIndex = state.deviceParameters.findIndex(
			(param) => param.name === parameter.name,
		);
		if (parameterIndex === -1) return state;

		const newParameters = state.deviceParameters.map((item, index) => {
			if (index !== parameterIndex) {
				return item;
			} else {
				return parameter;
			}
		});

		return {
			...state,
			deviceParameters: newParameters,
		};
	})
	// Установка списка отчетов по показаниям приборов
	.on(setDeviceReportsEvent, (state, deviceReports) => {
		return {
			...state,
			deviceReports,
		};
	})
	// Установка Список приборов для отчетов
	.on(setDevicesListEvent, (state, devicesList) => {
		return {
			...state,
			devicesList,
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
	.on(setDevicesIsLoading, (state, isLoading) => {
		return {
			...state,
			isLoading,
		};
	})
	// Отслеживание загрузки приборов
	.on(getDevicesListFx.doneData, (state) => {
		return { ...state, isLoading: false };
	});

/* ------------------------------------------ samples ------------------------------------------ */

// Запрос параметров прибора при изменении активного в таблице прибора
sample({
	clock: setActiveDeviceIdEvent,
	source: $deviceReports,
	fn: (sourceData) => {
		return {
			number: sourceData.activeDeviceId,
		} as DeviceParams;
	},
	target: getDeviceParametersFx,
});

// Отслеживание отправки запроса на загрузку параметров прибора
sample({
	clock: getDeviceParametersFx.doneData,
	target: setDeviceParametersEvent,
});

// Отслеживание отправки запроса на обновление параметра прибора
sample({
	clock: updateDeviceParameterFx.done,
	filter: ({ result }) => result,
	fn: ({ params }) => {
		const { name, value } = params;
		return {
			name,
			value,
		} as DeviceParameter;
	},
	target: updateDeviceParameterEvent,
});

// Отслеживание отправки запроса на загрузку списка отчетов по показаниям приборов
sample({
	clock: getDeviceReportsFx.doneData,
	target: setDeviceReportsEvent,
});

// Отслеживание отправки запроса на загрузку списка приборов для отчетов по показаниям приборов
sample({
	clock: getDevicesListFx.doneData,
	target: setDevicesListEvent,
});

// При изменении данных для таблицы сразу же присваиваем Id первого прибора оттуда в качестве активного в таблице
sample({
	clock: setDevicesListEvent,
	source: $deviceReports,
	// если activeDeviceId не поменялся, то ничего не делать
	filter: (sourceData, clockData) => {
		if (clockData.length > 0 && clockData[0].deviceId) {
			return (
				clockData[0].deviceId === sourceData.activeDeviceId ||
				// при первой загрузке или смене типа отчета нужно продолжить выполнение
				sourceData.activeDeviceId === 0
			);
		}
		return false;
	},
	fn: (_sourceData, clockData) => {
		return clockData[0].deviceId;
	},
	target: setActiveDeviceIdEvent,
});

// При изменении данных для таблицы сразу же наполняем фильтр типов прибора уникальными типами
sample({
	clock: setDevicesListEvent,
	source: $deviceReports,
	filter: (sourceData, clockData) => {
		/* Чтобы при переходе в режим редактирования и обратно не сбрасывались выбранные опции 
		в фильтре типа приборов, но сбрасывались при переключении типов отчетов
		 */
		if (clockData.length > 0 && sourceData.deviceTypeOptions.length === 0) {
			return (
				JSON.stringify(getFilterOptionsByDeviceType(clockData)) !==
				JSON.stringify(sourceData.deviceTypeOptions)
			);
		}
		return false;
	},
	fn: (_sourceData, clockData) => {
		return getFilterOptionsByDeviceType(clockData);
	},
	target: setDeviceTypeOptionsEvent,
});
