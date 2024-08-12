import { addDays, format, subDays } from 'date-fns';
import { createStore, sample } from 'effector';

import { FormTypes, Trend } from '../../Shared/types';
import { handleError } from '../../Utils/handleToast';
import { setUserSettings } from '../FormTabs/events';

import {
	fetchChannelsChartDataFx,
	fetchFormParametersFx,
	fetchVolumeOfMergedCondensateFx,
} from './effects';
import {
	changeDiscrete,
	fetchChartData,
	fetchCondensateDrainChartInfo,
	handleActiveChartFails,
	resetActiveChart,
	saveUserSettings,
	setActiveChartParameters,
	setActiveCondensateDrainChartTitle,
	setActiveCondensateDrainChartType,
	setChartData,
	setChartId,
	setChartIsLoading,
	setDateTimePeriod,
	setVolumeOfMergedCondensateData,
} from './events';
import { ActiveChart } from './types';
export const $activeChart = createStore<ActiveChart>({
	id: null,
	isTitleVisible: false,
	title: '',
	formType: FormTypes.CondensateDrainForm,
	isLoading: true,
	channelsChartData: [],
	tableHeader: [
		{
			accessor: 'date',
			text: 'Дата и время',
			isResizable: false,
			isSortable: false,
			sortOrder: 0,
			type: 'string',
			minWidth: 100,
			maxWidth: 150,
			width: 150,
		},
		{
			accessor: 'max',
			text: 'Максимум',
			isResizable: false,
			isSortable: false,
			sortOrder: 0,
			type: 'string',
			minWidth: 100,
			maxWidth: 150,
			width: 150,
		},
		{
			accessor: 'min',
			text: 'Минимум',
			isResizable: false,
			isSortable: false,
			sortOrder: 0,
			type: 'string',
			minWidth: 100,
			maxWidth: 150,
			width: 150,
		},
		{
			accessor: 'value',
			text: 'Объем',
			isResizable: false,
			isSortable: false,
			sortOrder: 0,
			type: 'string',
			minWidth: 100,
			maxWidth: 150,
			width: 150,
		},
		{
			accessor: 'result',
			text: 'Накопительный итог',
			isResizable: false,
			isSortable: false,
			sortOrder: 0,
			type: 'string',
			minWidth: 100,
			maxWidth: 150,
			width: 150,
		},
	],
	versionCode: 90,
	round: 2,
	startDateTime: new Date(
		`${format(subDays(new Date(), 1), 'yyyy.MM.dd')} 00:00:00`,
	),
	endDateTime: new Date(
		`${format(addDays(new Date(), 1), 'yyyy.MM.dd')} 00:00:00`,
	),
	discreteList: [
		{
			value: 'C',
			label: 'Текущие',
			isSelected: true,
		},
		{
			value: 'D',
			label: 'Суточные',
			isSelected: false,
		},
	],
	vertAxisName: '',
	channelNumber: null,
	volumeOfMergedCondensate: [],
});

$activeChart.on(resetActiveChart, (state) => ({
	...state,
	id: null,
	isTitleVisible: false,
	title: '',
	formType: FormTypes.CondensateDrainForm,
	isLoading: true,
	channelsChartData: [],
	tableHeader: [
		{
			accessor: 'date',
			text: 'Дата и время',
			isResizable: false,
			isSortable: false,
			sortOrder: 0,
			type: 'string',
			minWidth: 100,
			maxWidth: 150,
			width: 150,
		},
		{
			accessor: 'max',
			text: 'Максимум',
			isResizable: false,
			isSortable: false,
			sortOrder: 0,
			type: 'string',
			minWidth: 100,
			maxWidth: 150,
			width: 150,
		},
		{
			accessor: 'min',
			text: 'Минимум',
			isResizable: false,
			isSortable: false,
			sortOrder: 0,
			type: 'string',
			minWidth: 100,
			maxWidth: 150,
			width: 150,
		},
		{
			accessor: 'value',
			text: 'Объем',
			isResizable: false,
			isSortable: false,
			sortOrder: 0,
			type: 'string',
			minWidth: 100,
			maxWidth: 150,
			width: 150,
		},
		{
			accessor: 'result',
			text: 'Накопительный итог',
			isResizable: false,
			isSortable: false,
			sortOrder: 0,
			type: 'string',
			minWidth: 100,
			maxWidth: 150,
			width: 150,
		},
	],
	versionCode: 90,
	round: 2,
	startDateTime: new Date(
		`${format(subDays(new Date(), 1), 'yyyy.MM.dd')} 00:00:00`,
	),
	endDateTime: new Date(
		`${format(addDays(new Date(), 1), 'yyyy.MM.dd')} 00:00:00`,
	),
	discreteList: [
		{
			value: 'C',
			label: 'Текущие',
			isSelected: true,
		},
		{
			value: 'D',
			label: 'Суточные',
			isSelected: false,
		},
	],
	volumeOfMergedCondensate: [],
}));

$activeChart.on(setActiveChartParameters, (state, chartParameters) => ({
	...state,
	...chartParameters,
}));
$activeChart.watch(fetchChartData, (state) => {
	const { startDateTime, endDateTime, channelNumber, discreteList } = state;
	const discrete = discreteList.find((item) => item.isSelected);
	if (discrete && channelNumber) {
		fetchChannelsChartDataFx({
			startDateTime,
			channelNumber: channelNumber,
			endDateTime,
			discrete: String(discrete.value),
			canDiagUse: 0,
		});
		fetchVolumeOfMergedCondensateFx({
			startDateTime,
			channelNumber: channelNumber,
			endDateTime,
			discrete: String(discrete.value),
		});
	}
});

$activeChart.on(fetchChartData, (state) => {
	return {
		...state,
		isLoading: true,
	};
});

$activeChart.watch(fetchFormParametersFx.done, (state, payload) => {
	const chartParameters = payload.result;
	const { formId } = payload.params;
	setChartId(formId);
	setActiveChartParameters({ ...chartParameters });
	fetchChartData();
});

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
		channelsChartData: chartData,
	};
});
$activeChart.on(setVolumeOfMergedCondensateData, (state, chartData) => {
	return {
		...state,
		volumeOfMergedCondensate: chartData,
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

$activeChart.watch(setDateTimePeriod, () => {
	fetchChartData();
});

$activeChart.on(changeDiscrete, (state, discreteList) => {
	return {
		...state,
		discreteList: [...discreteList],
	};
});

$activeChart.watch(changeDiscrete, () => {
	fetchChartData();
});

$activeChart.watch(saveUserSettings, (state) => {
	const { startDateTime, endDateTime, discreteList, id, title, formType } =
		state;
	setUserSettings({
		formId: id ? id : undefined,
		title,
		formType,
		formSettings: {
			startDateTime,
			endDateTime,
			discreteList,
		},
	});
});

$activeChart.watch(fetchCondensateDrainChartInfo, (state, payload) => {
	const { id, title, formType, versionCode, userId } = payload;
	setActiveChartParameters({ title, formType, versionCode });
	setActiveCondensateDrainChartTitle(title);
	setActiveCondensateDrainChartType(formType);
	fetchFormParametersFx({ formId: id, versionCode, userId });
});

$activeChart.watch(handleActiveChartFails, (_state, { error }) => {
	handleError(error);
	setActiveChartParameters({ isLoading: false });
});

$activeChart.on(setActiveCondensateDrainChartTitle, (state, title) => {
	return {
		...state,
		title,
	};
});
$activeChart.on(setActiveCondensateDrainChartType, (state, formType) => {
	return {
		...state,
		formType: Object.values(FormTypes).includes(formType)
			? formType
			: FormTypes.Form,
	};
});

/* DECLARATIVES */

/**
 * Handle series fetched for the chart and update necessary stores
 */
sample({
	source: $activeChart,
	clock: fetchChannelsChartDataFx.done,
	fn: (sourceData, clockData) => {
		const { round, vertAxisName } = sourceData;
		const { result } = clockData;
		const newTrend: Trend = {
			name: 'Текущие показания',
			data: result,
			unitName: vertAxisName,
			round,
			visible: true,
			color: '#cccccc',
		};
		return [newTrend];
	},
	target: setChartData,
});
sample({
	clock: fetchVolumeOfMergedCondensateFx.done,
	fn: (clockData) => {
		const { result } = clockData;
		return result;
	},
	target: setVolumeOfMergedCondensateData,
});
/**
 * Set the loading indicator to false when chart data is loaded
 */
sample({
	clock: fetchVolumeOfMergedCondensateFx.done,
	fn: () => {
		return false;
	},
	target: setChartIsLoading,
});
