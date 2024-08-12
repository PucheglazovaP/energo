import { SortDirectionType } from 'react-virtualized';
import { createEvent, merge } from 'effector';

import { FormTypes, Trend, TypesStorage } from '../../Shared/types';
import { SelectOption } from '../../UI/Select/types';

import { fetchChartDataFx, fetchCurrChartKoefFx } from './effects';
import { ActiveChart, OptionWithCoefficient } from './types';

export const setActiveChartParameters = createEvent<Partial<ActiveChart>>();
export const setActiveChartTitle = createEvent<string>();
export const setActiveChartType = createEvent<FormTypes>();
export const resetActiveChart = createEvent();
export const setDateTimePeriod = createEvent<{
	startDateTime: Date;
	endDateTime: Date;
}>();
export const toggleTimeZone = createEvent<boolean>();
export const toggleArchiveMode = createEvent<boolean>();
export const toggleMultipleCount = createEvent<boolean>();
export const fetchChartData = createEvent<number>();
export const setChartData = createEvent<Trend[]>();
export const setChartIsLoading = createEvent<boolean>();
export const fetchChartInfo = createEvent<{
	id: number;
	title: string;
	formType: FormTypes;
	parentId?: number;
	versionCode: number;
	userId: string;
	typesStorage: TypesStorage;
}>();

export const toggleUpdateChart = createEvent<boolean>();
export const changeUpdateDelay = createEvent<number>();

export const changeDiscrete = createEvent<SelectOption[]>();
export const changeUnit = createEvent<OptionWithCoefficient[]>();

export const openWidgetFromChart = createEvent();

export const saveUserSettings = merge([
	setActiveChartParameters,
	toggleTimeZone,
	toggleArchiveMode,
	toggleUpdateChart,
	changeUpdateDelay,
	setDateTimePeriod,
	changeUnit,
	changeDiscrete,
	fetchCurrChartKoefFx.done,
	fetchChartDataFx.done,
]);
export const setChartId = createEvent<number>();

export const setTrendVisibleState = createEvent<number>();
export const setTypeGraphList = createEvent<SelectOption[]>();
export const setDateColumnSortDirection = createEvent<SortDirectionType>();
