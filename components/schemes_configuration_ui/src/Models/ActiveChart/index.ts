import { addDays, format, subDays } from 'date-fns';
import { createStore, merge, sample } from 'effector';

import { FormTypes, Trend, TypesStorage } from '../../Shared/types';
import { ModuleName } from '../../Shared/Types/moduleName';
import { getDatesForAggregateValues } from '../../Utils/dateUtils';
import { handleError } from '../../Utils/handleToast';
import { setUserSettings } from '../FormTabs/events';
import { setWidgetData, setWidgetOpen } from '../Widget/events';

import {
	fetchChartDataFx,
	fetchChartKoefListFx,
	fetchCurrChartKoefFx,
	fetchFormObjectsFx,
	fetchFormParametersFx,
	getTypeGraphEnumValuesFx,
} from './effects';
import {
	changeDiscrete,
	changeUnit,
	changeUpdateDelay,
	fetchChartData,
	fetchChartInfo,
	openWidgetFromChart,
	resetActiveChart,
	saveUserSettings,
	setActiveChartParameters,
	setActiveChartTitle,
	setActiveChartType,
	setChartData,
	setChartId,
	setChartIsLoading,
	setDateColumnSortDirection,
	setDateTimePeriod,
	setTrendVisibleState,
	setTypeGraphList,
	toggleArchiveMode,
	toggleMultipleCount,
	toggleTimeZone,
	toggleUpdateChart,
} from './events';
import { ActiveChart } from './types';
export const $activeChart = createStore<ActiveChart>({
	id: null,
	isTitleVisible: false,
	title: '',
	visdelayForm: 0,
	formType: FormTypes.Chart,
	isLoading: true,
	asqlUser: 0,
	asqlGroup: 9999,
	asqlType: 9999,
	useCapt: false,
	hlineVisible: false,
	hlineValue: 0,
	hlineColor: '#000000',
	hlineWidth: 0,
	hlineVisible1: false,
	hlineValue1: 0,
	hlineColor1: '#000000',
	hlineWidth1: 0,
	hlineVisible2: false,
	hlineValue2: 0,
	hlineColor2: '#000000',
	hlineWidth2: 0,
	asqlGroupName: null,
	asqlUserName: null,
	asqlTypeName: null,
	trendMode: '-1',
	chartData: [],
	tableHeader: [
		{
			accessor: 'date',
			text: 'Дата и время',
			isResizable: false,
			isSortable: false,
			sortOrder: 0,
			type: 'string',
			minWidth: 150,
			maxWidth: 150,
			width: 150,
		},
	],
	versionCode: 90,
	round: 10,
	typeGraph: 0,
	methodName: '',
	showOverperiodData: false,
	isMoscowTimeZone: false,
	startDateTime: new Date(
		`${format(subDays(new Date(), 1), 'yyyy.MM.dd')} 00:00:00`,
	),
	endDateTime: new Date(
		`${format(addDays(new Date(), 1), 'yyyy.MM.dd')} 00:00:00`,
	),
	unitList: [],
	isUpdateChartEnabled: false,
	updateDelay: 60,
	discreteList: [
		{
			value: 'C',
			label: '1 мин',
			isSelected: false,
			secondsValue: 60,
		},
		{
			value: 'HH',
			label: '30 мин',
			isSelected: false,
			secondsValue: 60 * 30,
		},
		{
			value: 'H',
			label: '60 мин',
			isSelected: true,
			secondsValue: 60 * 60,
		},
		{
			value: 'D',
			label: '1 д',
			isSelected: false,
			secondsValue: 60 * 60 * 24,
		},
		{
			value: 'M',
			label: '1 мес.',
			isSelected: false,
		},
	],
	isMultiYaxesEnabled: false,
	isTimeWithoutDataEnabled: false,
	isRelativeZeroEnabled: false,
	isArchiveModeEnabled: false,
	isConsumption: false,
	typesStorage: TypesStorage.Regulated,
	multipleCount: false,
	typeGraphList: [],
	dateColumnSortDirection: 'ASC',
});

$activeChart.on(resetActiveChart, (state) => ({
	...state,
	id: null,
	isTitleVisible: false,
	title: '',
	visdelayForm: 0,
	formType: FormTypes.Chart,
	formBackground: '',
	backgroundWidth: 0,
	backgroundHeight: 0,
	isLoading: true,
	asqlUser: 0,
	asqlGroup: 9999,
	asqlType: 9999,
	useCapt: false,
	hlineVisible: false,
	hlineValue: 0,
	hlineColor: '#000000',
	hlineWidth: 0,
	hlineVisible1: false,
	hlineValue1: 0,
	hlineColor1: '#000000',
	hlineWidth1: 0,
	hlineVisible2: false,
	hlineValue2: 0,
	hlineColor2: '#000000',
	hlineWidth2: 0,
	asqlGroupName: null,
	asqlUserName: null,
	asqlTypeName: null,
	trendMode: '-1',
	chartData: [],
	typeGraph: 0,
	tableHeader: [
		{
			accessor: 'date',
			text: 'Дата и время',
			isResizable: false,
			isSortable: false,
			sortOrder: 0,
			type: 'string',
			minWidth: 150,
			maxWidth: 150,
			width: 150,
		},
	],
	typeGraphList: [],
	unitList: [],
	versionCode: 90,
	round: 10,
	methodName: '',
	showOverperiodData: false,
	isConsumption: false,
	typesStorage: TypesStorage.Regulated,
}));

$activeChart.on(setActiveChartParameters, (state, chartParameters) => ({
	...state,
	...chartParameters,
}));
$activeChart.watch(fetchChartData, (state, asqlGroup) => {
	const {
		startDateTime,
		endDateTime,
		isMoscowTimeZone,
		discreteList,
		isArchiveModeEnabled,
		typeGraphList,
		typesStorage,
		methodName,
		multipleCount,
		chartData,
		formType,
	} = state;
	const filteredDiscreteList =
		typesStorage === TypesStorage.Regulated
			? discreteList
			: discreteList
					.filter((item) => item.label === '1 мин')
					.map((item) => ({ ...item, isSelected: true }));
	const discrete = filteredDiscreteList.find((item) => item.isSelected);
	let typeGraph = typeGraphList.find((item) => item.isSelected)?.value;
	let newMultipleCount = Number(multipleCount);
	if (formType === FormTypes.MultiChart) {
		const trend = chartData.find((item) => item.asqlGroup === asqlGroup);
		if (trend) {
			typeGraph = trend.typeGraph || 0;
			newMultipleCount = trend.multipleCount || 0;
		}
	}

	// костыль для правильного расчета агрегатных величин
	const [startDateTimeForRequest, endDateTimeForRequest] =
		getDatesForAggregateValues({
			startDateTime,
			endDateTime,
			methodName,
		});

	if (discrete)
		fetchChartDataFx({
			startDateTime: startDateTimeForRequest,
			gr: asqlGroup,
			isMoscowTimeZone,
			endDateTime: endDateTimeForRequest,
			discrete: isArchiveModeEnabled ? 'HA' : String(discrete.value),
			round: 6,
			gtype: typeGraph ? Number(typeGraph) : 0,
			moduleName: ModuleName.FetchChartData_watch_fetchChartDataFx,
			multipleCount: newMultipleCount,
		});
});

$activeChart.watch(fetchFormParametersFx.done, (state, payload) => {
	const { chartParameters } = payload.result;
	const { formId, userId } = payload.params;
	const { formType } = state;
	setChartId(formId);
	setActiveChartParameters({ ...chartParameters });
	if (
		chartParameters.asqlGroup &&
		(formType === FormTypes.Chart || formType === FormTypes.MultiChart)
	) {
		getTypeGraphEnumValuesFx();
		fetchCurrChartKoefFx({ gr: chartParameters.asqlGroup, userId });
	}
});

$activeChart.on(
	setDateColumnSortDirection,
	(state, dateColumnSortDirection) => ({
		...state,
		dateColumnSortDirection,
	}),
);
$activeChart.on(setChartIsLoading, (state, isLoading) => ({
	...state,
	isLoading,
}));
$activeChart.on(setChartId, (state, id) => ({
	...state,
	id,
}));
$activeChart.on(setChartData, (state, chartData) => {
	return {
		...state,
		chartData,
	};
});

$activeChart.on(setDateTimePeriod, (state, payload) => {
	const { startDateTime, endDateTime } = payload;
	return {
		...state,
		startDateTime,
		endDateTime,
	};
});

$activeChart.watch(setDateTimePeriod, (state) => {
	const { chartData } = state;
	Promise.all(
		chartData.map((item) => {
			if (item.asqlGroup && item.visible) fetchChartData(item.asqlGroup);
		}),
	);
});
$activeChart.on(toggleTimeZone, (state, payload) => {
	return {
		...state,
		isMoscowTimeZone: payload,
	};
});
$activeChart.on(toggleMultipleCount, (state, payload) => {
	return {
		...state,
		multipleCount: payload,
	};
});
$activeChart.watch(toggleTimeZone, (state) => {
	const { chartData } = state;
	Promise.all(
		chartData.map((item) => {
			if (item.asqlGroup && item.visible) fetchChartData(item.asqlGroup);
		}),
	);
});
$activeChart.watch(toggleMultipleCount, (state) => {
	const { chartData } = state;
	Promise.all(
		chartData.map((item) => {
			if (item.asqlGroup && item.visible) fetchChartData(item.asqlGroup);
		}),
	);
});
$activeChart.on(toggleArchiveMode, (state, payload) => {
	return {
		...state,
		isArchiveModeEnabled: payload,
	};
});
$activeChart.watch(toggleArchiveMode, (state) => {
	const { chartData } = state;
	Promise.all(
		chartData.map((item) => {
			if (item.asqlGroup && item.visible) fetchChartData(item.asqlGroup);
		}),
	);
});

$activeChart.on(toggleUpdateChart, (state, payload) => {
	return {
		...state,
		isUpdateChartEnabled: payload,
	};
});

$activeChart.on(changeUpdateDelay, (state, payload) => {
	const delay = payload === 0 ? 60 : payload;
	return {
		...state,
		updateDelay: delay,
	};
});

$activeChart.on(changeDiscrete, (state, discreteList) => {
	return {
		...state,
		discreteList: [...discreteList],
	};
});
$activeChart.on(setTypeGraphList, (state, list) => {
	return {
		...state,
		typeGraphList: list,
	};
});

$activeChart.watch(changeDiscrete, (state) => {
	const { chartData } = state;
	Promise.all(
		chartData.map((item) => {
			if (item.asqlGroup && item.visible) fetchChartData(item.asqlGroup);
		}),
	);
});
$activeChart.watch(setTypeGraphList, (state) => {
	const { chartData } = state;
	Promise.all(
		chartData.map((item) => {
			if (item.asqlGroup && item.visible) fetchChartData(item.asqlGroup);
		}),
	);
});

$activeChart.on(changeUnit, (state, unitsList) => {
	return {
		...state,
		unitList: [...unitsList],
	};
});

$activeChart.on(fetchChartKoefListFx.done, (state, payload) => {
	const { unitList } = payload.result;
	return {
		...state,
		unitList: [...state.unitList, ...unitList],
		isLoading: false,
	};
});

$activeChart.on(getTypeGraphEnumValuesFx.done, (state, { result }) => {
	const { typeGraph } = state;

	return {
		...state,
		typeGraphList: result.map((item) => ({
			...item,
			isSelected: Number(item.value) === typeGraph,
		})),
	};
});

$activeChart.watch(saveUserSettings, (state) => {
	const {
		isUpdateChartEnabled,
		updateDelay,
		isMoscowTimeZone,
		startDateTime,
		endDateTime,
		discreteList,
		unitList,
		isMultiYaxesEnabled,
		isTimeWithoutDataEnabled,
		isRelativeZeroEnabled,
		isArchiveModeEnabled,
		chartData,
		id,
		title,
		formType,
	} = state;
	setUserSettings({
		formId: id ? id : undefined,
		title,
		formType,
		formSettings: {
			isUpdateEnabled: isUpdateChartEnabled,
			updateDelay,
			isMoscowTimeZone,
			startDateTime,
			endDateTime,
			discreteList,
			unitList,
			isMultiYaxesEnabled,
			isTimeWithoutDataEnabled,
			isRelativeZeroEnabled,
			isArchiveModeEnabled,
			chartData,
		},
	});
});
$activeChart.watch(openWidgetFromChart, (state) => {
	const {
		isUpdateChartEnabled,
		updateDelay,
		isMoscowTimeZone,
		startDateTime,
		endDateTime,
		discreteList,
		unitList,
		isMultiYaxesEnabled,
		isTimeWithoutDataEnabled,
		isRelativeZeroEnabled,
		isArchiveModeEnabled,
		chartData,
		title,
		id,
	} = state;
	setWidgetData({
		title,
		formId: id ? id : undefined,
		formSettings: {
			isUpdateEnabled: isUpdateChartEnabled,
			updateDelay,
			isMoscowTimeZone,
			startDateTime,
			endDateTime,
			discreteList,
			unitList,
			isMultiYaxesEnabled,
			isTimeWithoutDataEnabled,
			isRelativeZeroEnabled,
			isArchiveModeEnabled,
			chartData,
		},
	});
	setWidgetOpen(true);
});

$activeChart.watch(fetchFormObjectsFx.done, (_state, { result }) => {
	const { chartData } = result;
	setChartData(chartData);
	Promise.all(
		chartData.map((item) => {
			if (item.asqlGroup && item.visible) fetchChartData(item.asqlGroup);
		}),
	);
});

$activeChart.watch(fetchChartInfo, (_state, payload) => {
	const { id, title, formType, parentId, versionCode, userId, typesStorage } =
		payload;
	setActiveChartParameters({
		title,
		formType,
		parentId,
		versionCode,
		typesStorage,
	});
	setActiveChartTitle(title);
	setActiveChartType(formType);
	fetchFormParametersFx({ formId: id, versionCode, userId });
});

const handleActiveChartFails = merge([
	fetchFormObjectsFx.fail,
	fetchChartKoefListFx.fail,
	fetchCurrChartKoefFx.fail,
	fetchChartDataFx.fail,
	fetchFormParametersFx.fail,
]);
$activeChart.watch(handleActiveChartFails, (_state, { error }) => {
	handleError(error);
	setActiveChartParameters({ isLoading: false });
});

$activeChart.on(setActiveChartTitle, (state, title) => {
	return {
		...state,
		title,
	};
});
$activeChart.on(setActiveChartType, (state, formType) => {
	return {
		...state,
		formType: Object.values(FormTypes).includes(formType)
			? formType
			: FormTypes.Form,
	};
});
$activeChart.on(setTrendVisibleState, (state, trendId) => {
	return {
		...state,
		chartData: state.chartData.map((item) => {
			if (item.id === trendId)
				return { ...item, isVisibleOnChart: !item.isVisibleOnChart };
			return item;
		}),
	};
});

$activeChart.on(fetchCurrChartKoefFx.done, (state, payload) => {
	const { unitId, unitName, methodName, isConsumption } = payload.result;
	const { gr: groupNumber } = payload.params;
	return {
		...state,
		unitList: [
			{
				value: String(unitId),
				label: String(unitName),
				coefficient: 1,
				isSelected: true,
			},
		],
		chartData: state.chartData.map((item) => {
			if (item.asqlGroup === groupNumber)
				return {
					...item,
					unitName,
				};
			return item;
		}),
		methodName,
		isConsumption,
	};
});

sample({
	clock: fetchCurrChartKoefFx.done,
	source: $activeChart,
	fn: (sourceData) => {
		const { asqlGroup } = sourceData;
		return asqlGroup;
	},
	target: fetchChartData,
});
sample({
	clock: fetchCurrChartKoefFx.done,
	fn: (clockData) => {
		const {
			result: { unitId },
		} = clockData;
		return unitId || 0;
	},
	target: fetchChartKoefListFx,
});
/* DECLARATIVES */

/**
 * Handle series fetched for the chart and update necessary stores
 */
sample({
	source: $activeChart,
	clock: fetchChartDataFx.done,
	fn: (sourceData, clockData) => {
		const { formType, title, chartData, round, typeGraph, multipleCount } =
			sourceData;
		const {
			params: { gr: fetchedGroup },
			result: { chartData: fetchedData },
		} = clockData;
		if (formType === FormTypes.Chart) {
			const newTrend: Trend = {
				name: title,
				data: fetchedData,
				unitName: '',
				asqlGroup: fetchedGroup,
				round,
				visible: true,
				typeGraph,
				multipleCount: Number(multipleCount),
				isVisibleOnChart: true,
				id: 1,
			};
			return [newTrend];
		}
		const trends: Trend[] = chartData.map((trend) => {
			if (trend.asqlGroup === fetchedGroup) {
				return {
					...trend,
					data: fetchedData,
					unitName: '',
					asqlGroup: fetchedGroup,
				};
			}
			return trend;
		});
		return trends;
	},
	target: setChartData,
});

/**
 * Set the loading indicator to false when chart data is loaded
 */
sample({
	clock: fetchChartDataFx.done,
	fn: () => {
		return false;
	},
	target: setChartIsLoading,
});
