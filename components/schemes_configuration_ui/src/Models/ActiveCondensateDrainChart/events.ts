import { createEvent, merge } from 'effector';

import { FormTypes, Trend, VolumeOfMergedCondensate } from '../../Shared/types';
import { SelectOption } from '../../UI/Select/types';

import { fetchFormParametersFx } from './effects';
import { ActiveChart } from './types';

export const setActiveChartParameters = createEvent<Partial<ActiveChart>>();
export const setActiveCondensateDrainChartTitle = createEvent<string>();
export const setActiveCondensateDrainChartType = createEvent<FormTypes>();
export const resetActiveChart = createEvent();
export const setDateTimePeriod = createEvent<{
	startDateTime: Date;
	endDateTime: Date;
}>();
export const fetchChartData = createEvent();
export const setChartData = createEvent<Trend[]>();
export const setVolumeOfMergedCondensateData =
	createEvent<VolumeOfMergedCondensate[]>();
export const setChartIsLoading = createEvent<boolean>();
export const fetchCondensateDrainChartInfo = createEvent<{
	id: number;
	title: string;
	formType: FormTypes;
	versionCode: number;
	userId: string;
}>();

export const changeDiscrete = createEvent<SelectOption[]>();

export const saveUserSettings = merge([
	setActiveChartParameters,
	setDateTimePeriod,
	changeDiscrete,
	setChartData,
]);
export const handleActiveChartFails = merge([fetchFormParametersFx.fail]);
export const setChartId = createEvent<number>();
