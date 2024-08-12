import { SortDirectionType } from 'react-virtualized';
import { createEvent } from 'effector';

import { SelectOption } from '../../UI/Select/types';

import { DynamicChart } from './types';

export const setDynamicChartParameters = createEvent<Partial<DynamicChart>>();
export const getDataForDynamicChart = createEvent();

export const resetDynamicChart = createEvent();

export const setDateTimePeriod = createEvent<{
	startDateTime: Date;
	endDateTime: Date;
}>();
export const toggleTimeZone = createEvent<boolean>();
export const fetchChartData = createEvent<{
	groupNumber: number;
	userId: string;
	methodName: string;
}>();

export const toggleUpdateChart = createEvent<boolean>();
export const changeUpdateDelay = createEvent<number>();
export const updateCharts = createEvent<string>();

export const changeDiscrete = createEvent<SelectOption[]>();
export const changeUnit = createEvent<string>();

export const setChartIds = createEvent<{
	groupNumber: number;
	isChecked: boolean;
	name: string;
}>();
export const resetChartIds = createEvent();
export const setDateColumnSortDirection = createEvent<SortDirectionType>();
