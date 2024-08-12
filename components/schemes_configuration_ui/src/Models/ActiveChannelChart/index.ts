import { addDays, format } from 'date-fns';
import { createStore, merge, sample } from 'effector';

import {
	ChannelsChartDataParams,
	FormTypes,
	statusDetails,
	Trend,
} from '../../Shared/types';
import { getDatesForChannelsAggregateValues } from '../../Utils/dateUtils';
import { getFormType } from '../../Utils/getFormType';
import { handleError } from '../../Utils/handleToast';
import { $channels } from '../Channels';
import { setChannelsActiveNode } from '../Channels/events';
import { ChannelsModel } from '../Channels/types';
import { setUserSettings } from '../FormTabs/events';
import { $navigation } from '../Navigation';
import { setNavigation } from '../Navigation/events';
import { NavigationModel } from '../Navigation/types';

import { fetchChannelsChartDataFx, fetchChartKoefListFx } from './effects';
import {
	changeDiscrete,
	changeUpdateDelay,
	fetchChannelChartById,
	fetchChartData,
	resetActiveChannelChart,
	saveUserSettings,
	setActiveChannelChartParameters,
	setActiveChannelChartTitle,
	setActiveChannelChartType,
	setActiveChannelFormGroupInfo,
	setChannelChartConsumptionStatus,
	setChannelChartMethodName,
	setChannelChartStorageType,
	setDateColumnSortDirection,
	setDateTimePeriod,
	setUnitList,
	toggleArchiveMode,
	toggleTimeZone,
	toggleUpdateChart,
} from './events';
import { ActiveChannelChart, ChartSettingsModel } from './types';
export const $activeChart = createStore<ActiveChannelChart>({
	id: null,
	title: '',
	formType: FormTypes.DeviceChart,
	isLoading: false,
	chartData: [],
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
	],
	versionCode: 90,
	round: 10,
	methodName: '',
	showOverperiodData: false,
	isMoscowTimeZone: false,
	startDateTime: new Date(`${format(new Date(), 'yyyy.MM.dd')} 00:00:00`),
	endDateTime: new Date(
		`${format(addDays(new Date(), 1), 'yyyy.MM.dd')} 00:00:00`,
	),
	isUpdateChartEnabled: false,
	updateDelay: 60,
	// регламентированность данных
	typeStorage: '',
	discreteList: [
		{
			value: 'C',
			label: '1 мин',
			isSelected: true,
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
			isSelected: false,
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
	unitList: [],
	dateColumnSortDirection: 'ASC',
	channelsData: [],
});

// Store that holds settings for chart (like date time, discrete, etc...)
export const $chartSettings = $activeChart.map<ChartSettingsModel>(
	(activeChartModel) => {
		const { isMoscowTimeZone, discreteList, startDateTime, endDateTime } =
			activeChartModel;
		return {
			isMoscowTimeZone,
			discreteList,
			startDateTime,
			endDateTime,
		};
	},
);

$activeChart.on(resetActiveChannelChart, (state) => ({
	...state,
	id: null,
	title: '',
	formType: FormTypes.DeviceChart,
	isLoading: false,
	chartData: [],
	channelsData: [],
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
	],
	unitList: [],
	versionCode: 90,
	round: 10,
	methodName: '',
	// регламентированность данных
	typeStorage: '',
	showOverperiodData: false,
	isConsumption: false,
}));

$activeChart.on(setActiveChannelChartParameters, (state, chartParameters) => ({
	...state,
	...chartParameters,
}));

$activeChart.on(fetchChartData, (state) => {
	return {
		...state,
		isLoading: true,
	};
});
$activeChart.watch(fetchChartData, (state) => {
	const {
		methodName,
		isMoscowTimeZone,
		discreteList,
		id,
		startDateTime,
		endDateTime,
	} = state;
	const discrete =
		discreteList.find((item) => item.isSelected)?.value.toString() || 'C';
	const [startDateTimeForRequest, endDateTimeForRequest] =
		getDatesForChannelsAggregateValues({
			startDateTime,
			endDateTime,
			methodName,
		});
	if (id) {
		const params = {
			discrete,
			isMoscowTimeZone,
			channelNumber: id,
			startDateTime: startDateTimeForRequest,
			endDateTime: endDateTimeForRequest,
		};
		fetchChannelsChartDataFx(params);
	}
});
$activeChart.watch(setDateTimePeriod, (state, payload) => {
	const { isMoscowTimeZone, discreteList, id, methodName } = state;
	const { startDateTime, endDateTime } = payload;
	const [startDateTimeForRequest, endDateTimeForRequest] =
		getDatesForChannelsAggregateValues({
			startDateTime,
			endDateTime,
			methodName,
		});
	const discrete =
		discreteList.find((item) => item.isSelected)?.value.toString() || 'C';
	if (id) {
		const params = {
			discrete,
			isMoscowTimeZone,
			channelNumber: id,
			startDateTime: startDateTimeForRequest,
			endDateTime: endDateTimeForRequest,
		};
		fetchChannelsChartDataFx(params);
	}
});

$activeChart.on(setDateTimePeriod, (state, payload) => {
	const { startDateTime, endDateTime } = payload;
	return {
		...state,
		startDateTime,
		endDateTime,
	};
});

$activeChart.watch(toggleTimeZone, (state, payload) => {
	const { endDateTime, startDateTime, discreteList, id, methodName } = state;
	const discrete =
		discreteList.find((item) => item.isSelected)?.value.toString() || 'C';
	const [startDateTimeForRequest, endDateTimeForRequest] =
		getDatesForChannelsAggregateValues({
			startDateTime,
			endDateTime,
			methodName,
		});
	if (id) {
		const params = {
			discrete,
			isMoscowTimeZone: payload,
			channelNumber: id,
			startDateTime: startDateTimeForRequest,
			endDateTime: endDateTimeForRequest,
		};
		fetchChannelsChartDataFx(params);
	}
});
$activeChart.on(toggleTimeZone, (state, payload) => {
	return {
		...state,
		isMoscowTimeZone: payload,
	};
});
$activeChart.watch(toggleArchiveMode, (state, isArchiveModeEnabled) => {
	const {
		endDateTime,
		methodName,
		startDateTime,
		discreteList,
		isMoscowTimeZone,
		id,
	} = state;
	const [startDateTimeForRequest, endDateTimeForRequest] =
		getDatesForChannelsAggregateValues({
			startDateTime,
			endDateTime,
			methodName,
		});
	const discrete =
		discreteList.find((item) => item.isSelected)?.value.toString() || 'C';
	if (id) {
		const params = {
			discrete: isArchiveModeEnabled ? 'HA' : discrete,
			isMoscowTimeZone,
			channelNumber: id,
			startDateTime: startDateTimeForRequest,
			endDateTime: endDateTimeForRequest,
		};
		fetchChannelsChartDataFx(params);
	}
});

$activeChart.on(toggleArchiveMode, (state, payload) => {
	return {
		...state,
		isArchiveModeEnabled: payload,
	};
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
$activeChart.on(setUnitList, (state, unitList) => {
	return {
		...state,
		unitList: [...unitList],
	};
});

$activeChart.watch(changeDiscrete, (state, discreteList) => {
	const { endDateTime, startDateTime, isMoscowTimeZone, id, methodName } =
		state;
	const discrete =
		discreteList.find((item) => item.isSelected)?.value.toString() || 'C';
	const [startDateTimeForRequest, endDateTimeForRequest] =
		getDatesForChannelsAggregateValues({
			startDateTime,
			endDateTime,
			methodName,
		});
	if (id) {
		const params = {
			discrete,
			isMoscowTimeZone,
			channelNumber: id,
			startDateTime: startDateTimeForRequest,
			endDateTime: endDateTimeForRequest,
		};
		fetchChannelsChartDataFx(params);
	}
});

$activeChart.watch(saveUserSettings, (state) => {
	const {
		isUpdateChartEnabled,
		updateDelay,
		isMoscowTimeZone,
		startDateTime,
		endDateTime,
		discreteList,
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
		formId: id ? Number(id) : undefined,
		title,
		formType,
		formSettings: {
			isUpdateEnabled: isUpdateChartEnabled,
			updateDelay,
			isMoscowTimeZone,
			startDateTime,
			endDateTime,
			discreteList,
			unitList: [],
			isMultiYaxesEnabled,
			isTimeWithoutDataEnabled,
			isRelativeZeroEnabled,
			isArchiveModeEnabled,
			chartData,
		},
	});
});

const handleActiveChartFails = merge([fetchChannelsChartDataFx.fail]);
$activeChart.watch(handleActiveChartFails, (_state, { error }) => {
	handleError(error);
	setActiveChannelChartParameters({ isLoading: false });
});

$activeChart.watch(setChannelsActiveNode, (state, node) => {
	resetActiveChannelChart();
	if (node) {
		if (node.type === 'channel') {
			const {
				startDateTime,
				endDateTime,
				discreteList,
				isMoscowTimeZone,
				methodName,
			} = state;
			const discrete =
				discreteList.find((item) => item.isSelected)?.value.toString() || 'H';
			const [startDateTimeForRequest, endDateTimeForRequest] =
				getDatesForChannelsAggregateValues({
					startDateTime,
					endDateTime,
					methodName,
				});
			const params = {
				discrete,
				isMoscowTimeZone,
				channelNumber: node.id,
				startDateTime: startDateTimeForRequest,
				endDateTime: endDateTimeForRequest,
			};
			setActiveChannelChartParameters({
				isLoading: true,
				id: node.id,
			});
			fetchChannelsChartDataFx(params);
		}
		setActiveChannelChartTitle(node.displayName);
		setActiveChannelChartType(FormTypes.ChannelChart);
		setActiveChannelChartParameters({
			title: node.displayName,
			formType: FormTypes.ChannelChart,
		});
	}
});
$activeChart.watch(
	setActiveChannelFormGroupInfo,
	(
		state,
		{
			id,
			unitId,
			channelName,
			unitName,
			isConsumption,
			methodName,
			typeStorage,
		},
	) => {
		resetActiveChannelChart();
		setChannelChartMethodName(methodName);
		setChannelChartStorageType(typeStorage);
		setChannelChartConsumptionStatus(isConsumption);
		fetchChartKoefListFx({ unitId, unitName });
		const { startDateTime, endDateTime, discreteList, isMoscowTimeZone } =
			state;
		const discrete =
			discreteList.find((item) => item.isSelected)?.value.toString() || 'H';
		const [startDateTimeForRequest, endDateTimeForRequest] =
			getDatesForChannelsAggregateValues({
				startDateTime,
				endDateTime,
				methodName,
			});
		const params = {
			discrete,
			isMoscowTimeZone,
			channelNumber: id,
			startDateTime: startDateTimeForRequest,
			endDateTime: endDateTimeForRequest,
		};
		setActiveChannelChartParameters({
			isLoading: true,
			id: id,
		});
		fetchChannelsChartDataFx(params);
		setActiveChannelChartParameters({
			title: channelName,
		});
	},
);
$activeChart.on(fetchChannelsChartDataFx, (state) => {
	return {
		...state,
		isLoading: true,
	};
});
$activeChart.on(fetchChannelsChartDataFx.done, (state, payload) => {
	const { chartData, channelsData } = payload.result;
	const { round } = state;
	const { channelNumber } = payload.params;
	const newTrends: Trend[] = Array.from(chartData.entries()).map(
		([key, value]) => {
			const status = statusDetails[key as keyof typeof statusDetails];
			return {
				name: status?.message || '',
				data: value,
				unitName: '',
				id: key,
				round,
				color: status?.color || ' ',
				typeGraph: 0,
			};
		},
	);

	return {
		...state,
		chartData: newTrends,
		isLoading: false,
		id: channelNumber,
		channelsData,
	};
});
$activeChart.on(setActiveChannelChartTitle, (state, title) => {
	return {
		...state,
		title,
	};
});
$activeChart.on(setActiveChannelChartType, (state, formType) => {
	return {
		...state,
		formType: Object.values(FormTypes).includes(formType)
			? formType
			: FormTypes.Form,
	};
});
$activeChart.on(setChannelChartMethodName, (state, methodName) => {
	return {
		...state,
		methodName,
	};
});
$activeChart.on(setChannelChartStorageType, (state, typeStorage) => {
	return {
		...state,
		typeStorage,
	};
});
$activeChart.on(
	setDateColumnSortDirection,
	(state, dateColumnSortDirection) => ({
		...state,
		dateColumnSortDirection,
	}),
);
$activeChart.on(setChannelChartConsumptionStatus, (state, isConsumption) => {
	return {
		...state,
		isConsumption,
	};
});
sample({
	clock: fetchChannelsChartDataFx.done,
	source: $channels,
	filter: (sourceData) => sourceData.list.length > 0,
	fn: (sourceData, clockData) => {
		const { list: channelList } = sourceData;
		const { channelNumber } = clockData.params;
		const channel = channelList.find((item) => item.id === channelNumber);
		if (channel) return channel.method;
		return '';
	},
	target: setChannelChartMethodName,
});
sample({
	clock: fetchChannelsChartDataFx.done,
	source: $channels,
	filter: (sourceData) => sourceData.list.length > 0,
	fn: (sourceData, clockData) => {
		const { list: channelList } = sourceData;
		const { channelNumber } = clockData.params;
		const channel = channelList.find((item) => item.id === channelNumber);
		if (channel) return channel.typesStorage;
		return '';
	},
	target: setChannelChartStorageType,
});
sample({
	clock: fetchChannelsChartDataFx.done,
	source: $channels,
	filter: (sourceData) => sourceData.list.length > 0,
	fn: (sourceData, clockData) => {
		const { list: channelList } = sourceData;
		const { channelNumber } = clockData.params;
		const channel = channelList.find((item) => item.id === channelNumber);
		if (channel) return channel.isConsumption;
		return false;
	},
	target: setChannelChartConsumptionStatus,
});
sample({
	clock: fetchChartKoefListFx.done,
	fn: ({ result, params: { unitName, unitId } }) => {
		return [
			{
				value: String(unitId),
				label: String(unitName),
				coefficient: 1,
				isSelected: true,
			},
			...result,
		];
	},
	target: setUnitList,
});

// reset active channel chart before fetching the new channel
sample({
	clock: fetchChannelChartById,
	target: resetActiveChannelChart,
});

// Set form type and form name for navigation to show it in the title section
sample({
	clock: fetchChannelsChartDataFx.done,
	source: [$channels, $navigation],
	fn: (src, clk) => {
		const [channelsModel, navigationModel] = src as [
			ChannelsModel,
			NavigationModel,
		];
		const { list: channelList } = channelsModel;
		const { channelNumber } = clk.params;
		const channel = channelList.find((item) => item.id === channelNumber);
		const formType: FormTypes = getFormType(navigationModel.treeType);
		if (!channel) return {};
		return {
			activeFormName: channel.name,
			activeFormType: formType,
		};
	},
	target: setNavigation,
});

sample({
	clock: fetchChannelsChartDataFx.done,
	source: [$channels, $navigation],
	fn: (src, clk) => {
		const [channelsModel, navigationModel] = src as [
			ChannelsModel,
			NavigationModel,
		];
		const { list: channelList } = channelsModel;
		const { channelNumber } = clk.params;
		const channel = channelList.find((item) => item.id === channelNumber);

		const formType: FormTypes = getFormType(navigationModel.treeType);
		if (channel?.id && channel?.name)
			return {
				id: channel?.id,
				title: channel?.name,
				formType,
			};
		return {
			formType,
		};
	},
	target: setActiveChannelChartParameters,
});

// Fetch channel chart
sample({
	clock: fetchChannelChartById,
	source: [$chartSettings, $channels],
	fn: (src, clk) => {
		const [chartSettingsModel, channels] = src as [
			ChartSettingsModel,
			ChannelsModel,
		];
		const { list: channelList } = channels;
		const channel = channelList.find((item) => item.id === clk);
		const methodName = channel?.method || '';
		const { discreteList, endDateTime, isMoscowTimeZone, startDateTime } =
			chartSettingsModel;
		const discrete: string =
			discreteList.find((d) => d.isSelected)?.value.toString() || 'H';
		const [startDateTimeForRequest, endDateTimeForRequest] =
			getDatesForChannelsAggregateValues({
				startDateTime,
				endDateTime,
				methodName,
			});
		const params: ChannelsChartDataParams = {
			channelNumber: clk,
			endDateTime: endDateTimeForRequest,
			isMoscowTimeZone,
			startDateTime: startDateTimeForRequest,
			discrete,
		};
		return params;
	},
	target: fetchChannelsChartDataFx,
});
