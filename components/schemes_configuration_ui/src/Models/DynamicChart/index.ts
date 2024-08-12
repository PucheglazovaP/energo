import { addDays, format, subDays } from 'date-fns';
import { createStore, sample } from 'effector';

import { FormTypes, User } from '../../Shared/types';
import { ModuleName } from '../../Shared/Types/moduleName';
import { getDatesForAggregateValues } from '../../Utils/dateUtils';
import { $user } from '../Auth';

import { fetchChartDataFx, fetchCurrChartKoefFx } from './effects';
import {
	changeDiscrete,
	changeUpdateDelay,
	fetchChartData,
	getDataForDynamicChart,
	resetChartIds,
	resetDynamicChart,
	setChartIds,
	setDateColumnSortDirection,
	setDateTimePeriod,
	setDynamicChartParameters,
	toggleTimeZone,
	toggleUpdateChart,
	updateCharts,
} from './events';
import { DynamicChart } from './types';

export const $dynamicChart = createStore<DynamicChart>({
	formType: FormTypes.MultiChart,
	isLoading: true,
	chartData: [],
	tableHeader: [
		{
			accessor: 'date',
			text: 'Дата и время',
			isResizable: false,
			isSortable: false,
			isVisible: true,
			sortOrder: 0,
			type: 'string',
			minWidth: 300,
			width: 300,
		},
	],
	isMoscowTimeZone: false,
	startDateTime: new Date(
		`${format(subDays(new Date(), 1), 'yyyy.MM.dd')} 00:00:00`,
	),
	endDateTime: new Date(
		`${format(addDays(new Date(), 1), 'yyyy.MM.dd')} 00:00:00`,
	),
	isUpdateChartEnabled: false,
	updateDelay: 60,
	discreteList: [
		{
			value: 'C',
			label: '1 мин',
			isSelected: false,
		},
		{
			value: 'HH',
			label: '30 мин',
			isSelected: true,
		},
		{
			value: 'H',
			label: '60 мин',
			isSelected: false,
		},
		{
			value: 'D',
			label: '1 д',
			isSelected: false,
		},
		{
			value: 'M',
			label: '1 мес.',
			isSelected: false,
		},
	],
	isMultiYaxesEnabled: false,
	isRelativeZeroEnabled: false,
	isTimeWithoutDataEnabled: false,
	dateColumnSortDirection: 'ASC',
});

$dynamicChart.on(resetDynamicChart, (state) => {
	const { chartData } = state;
	return {
		...state,
		formType: FormTypes.MultiChart,
		isLoading: true,
		chartData: chartData.map((item) => ({ ...item, data: [] })),
		tableHeader: [
			{
				accessor: 'date',
				text: 'Дата и время',
				isResizable: false,
				isSortable: false,
				isVisible: true,
				sortOrder: 0,
				type: 'string',
				minWidth: 300,
				width: 300,
			},
		],
		isMoscowTimeZone: false,
		startDateTime: new Date(
			`${format(subDays(new Date(), 1), 'yyyy.MM.dd')} 00:00:00`,
		),
		endDateTime: new Date(
			`${format(addDays(new Date(), 1), 'yyyy.MM.dd')} 00:00:00`,
		),
		isUpdateChartEnabled: false,
		updateDelay: 60,
	};
});

$dynamicChart.on(setDynamicChartParameters, (state, chartParameters) => {
	return {
		...state,
		...chartParameters,
	};
});
$dynamicChart.on(
	setDateColumnSortDirection,
	(state, dateColumnSortDirection) => ({
		...state,
		dateColumnSortDirection,
	}),
);
$dynamicChart.on(setChartIds, (state, payload) => {
	const { groupNumber, name, isChecked } = payload;
	if (isChecked) {
		return {
			...state,
			chartData: [
				...state.chartData,
				{
					name,
					asqlGroup: groupNumber,
					unitName: '',
					data: [],
					round: 2,
					typeGraph: 0,
				},
			].sort((a, b) => {
				if (a.asqlGroup && b.asqlGroup) return a.asqlGroup - b.asqlGroup;
				return -1;
			}),
		};
	}
	return {
		...state,
		chartData: state.chartData
			.filter((item) => item.asqlGroup !== groupNumber)
			.sort((a, b) => {
				if (a.asqlGroup && b.asqlGroup) return a.asqlGroup - b.asqlGroup;
				return -1;
			}),
	};
});

$dynamicChart.on(resetChartIds, (state) => {
	return {
		...state,
		chartData: [],
	};
});

$dynamicChart.watch(fetchChartData, (state, { groupNumber, methodName }) => {
	const { startDateTime, endDateTime, isMoscowTimeZone, discreteList } = state;
	const discrete = discreteList.find((item) => item.isSelected);
	const [startDateTimeForRequest, endDateTimeForRequest] =
		getDatesForAggregateValues({
			startDateTime,
			endDateTime,
			methodName,
		});
	if (discrete)
		fetchChartDataFx({
			startDateTime: startDateTimeForRequest,
			gr: groupNumber,
			isMoscowTimeZone,
			endDateTime: endDateTimeForRequest,
			discrete: String(discrete.value),
			gtype: 0,
			round: 2,
			moduleName: ModuleName.FetchChartData_watch_fetchChartDataFx,
		});
});

$dynamicChart.on(fetchChartDataFx.done, (state, payload) => {
	const { chartData } = payload.result;
	const { gr } = payload.params;
	return {
		...state,
		chartData: state.chartData.map((item) => {
			if (item.asqlGroup === gr)
				return {
					...item,
					data: chartData,
					unitName: '',
					asqlGroup: gr,
				};
			return item;
		}),
	};
});

$dynamicChart.on(fetchCurrChartKoefFx.done, (state, payload) => {
	const {
		result: { unitName, methodName, isConsumption },
	} = payload;
	const { gr: groupNumber } = payload.params;

	return {
		...state,
		chartData: state.chartData.map((item) => {
			if (item.asqlGroup === groupNumber)
				return {
					...item,
					unitName,
					methodName,
					isConsumption,
				};
			return item;
		}),
		isLoading: false,
	};
});

$dynamicChart.on(setDateTimePeriod, (state, payload) => {
	const { startDateTime, endDateTime } = payload;
	return {
		...state,
		startDateTime,
		endDateTime,
		isLoading: true,
	};
});
$dynamicChart.on(changeDiscrete, (state, discreteList) => {
	return {
		...state,
		discreteList: [...discreteList],
	};
});

$dynamicChart.on(toggleUpdateChart, (state, payload) => {
	return {
		...state,
		isUpdateChartEnabled: payload,
	};
});

$dynamicChart.on(changeUpdateDelay, (state, payload) => {
	const delay = payload === 0 ? 60 : payload;
	return {
		...state,
		updateDelay: delay,
	};
});
sample({
	clock: [setDateTimePeriod, changeDiscrete, toggleTimeZone],
	source: $user,
	fn: (sourceData) => {
		const user = sourceData as User;
		return user.preferredUsername || '';
	},
	target: updateCharts,
});
sample({
	clock: getDataForDynamicChart,
	source: $user,
	fn: (user) => {
		return user?.preferredUsername || '';
	},
	target: updateCharts,
});

$dynamicChart.on(updateCharts, (state) => {
	return {
		...state,
		chartData: state.chartData.map((item) => ({ ...item, data: [] })),
		isLoading: true,
	};
});

$dynamicChart.watch(updateCharts, (state, userId) => {
	const { chartData } = state;
	Promise.all(
		chartData
			.filter((item) => item.asqlGroup != null)
			.map((chart) =>
				fetchCurrChartKoefFx({
					gr: chart.asqlGroup as number,
					userId,
				}),
			),
	);
});
$dynamicChart.watch(
	fetchCurrChartKoefFx.done,
	(state, { params: { userId } }) => {
		const { chartData } = state;
		Promise.all(
			chartData
				.filter((item) => item.asqlGroup != null)
				.map((chart) =>
					fetchChartData({
						groupNumber: chart.asqlGroup as number,
						userId,
						methodName: chart.methodName || 'Сумма',
					}),
				),
		);
	},
);
$dynamicChart.on(toggleTimeZone, (state, payload) => {
	return {
		...state,
		isMoscowTimeZone: payload,
	};
});
