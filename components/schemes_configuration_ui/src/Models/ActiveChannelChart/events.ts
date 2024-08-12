import { SortDirectionType } from 'react-virtualized';
import { createEvent, merge } from 'effector';

import { FormTypes } from '../../Shared/types';
import { SelectOption } from '../../UI/Select/types';
import {
	setDevicesActiveNode,
	setDevicesChannelActiveNode,
} from '../Devices/events';
import { loadInfoFromActiveForm } from '../FormTabs/events';

import { fetchChannelsChartDataFx } from './effects';
import { ActiveChannelChart, OptionWithCoefficient } from './types';

export const setActiveChannelChartParameters =
	createEvent<Partial<ActiveChannelChart>>();
export const setActiveChannelChartTitle = createEvent<string>();
export const setActiveChannelChartType = createEvent<FormTypes>();
export const resetActiveChannelChart = createEvent();
export const setDateTimePeriod = createEvent<{
	startDateTime: Date;
	endDateTime: Date;
}>();
export const toggleTimeZone = createEvent<boolean>();
export const toggleArchiveMode = createEvent<boolean>();
export const fetchChartData = createEvent();
export const fetchChartInfo = createEvent<{
	id: number;
	title: string;
	formType: FormTypes;
	parentId?: number;
	versionCode: number;
}>();

export const toggleUpdateChart = createEvent<boolean>();
export const changeUpdateDelay = createEvent<number>();

export const changeDiscrete = createEvent<SelectOption[]>();
export const setUnitList = createEvent<OptionWithCoefficient[]>();

export const setChannelChartMethodName = createEvent<string>();
export const setChannelChartConsumptionStatus = createEvent<boolean>();
export const setChannelChartStorageType = createEvent<string>();

export const fetchChannelChartById = createEvent<number>();

export const saveUserSettings = merge([
	setActiveChannelChartParameters,
	toggleTimeZone,
	toggleArchiveMode,
	toggleUpdateChart,
	changeUpdateDelay,
	setDateTimePeriod,
	changeDiscrete,
	fetchChannelsChartDataFx.done,
	loadInfoFromActiveForm,
]);

export const selectNodeFromDeviceTree = merge([
	setDevicesChannelActiveNode,
	setDevicesActiveNode,
]);

export const setActiveChannelFormGroupInfo = createEvent<{
	id: number;
	channelName: string;
	unitId: number;
	unitName: string;
	methodName: string;
	isConsumption: boolean;
	typeStorage: string;
}>();
export const setDateColumnSortDirection = createEvent<SortDirectionType>();
