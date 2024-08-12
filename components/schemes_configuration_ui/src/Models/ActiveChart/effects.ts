/* eslint-disable no-undef */
import { createEffect } from 'effector';

import {
	currChartKoefAdapter,
	unitListAdapter,
} from '../../Adapters/chart/chartDataAdapter';
import {
	chartDataAdapter,
	chartParametersAdapter,
	seriesAdapter,
} from '../../Adapters/formDataAdapter';
import { getEnumValuesAdapter } from '../../Adapters/getEnumValuesAdapter';
import { getKoefList } from '../../Const/Queries';
import {
	getChartCurrentKoef,
	getChartDataQuery,
} from '../../Const/Queries/chart';
import { getFormParametersQuery } from '../../Const/Queries/form';
import { getFormObjectsQuery } from '../../Const/Queries/formObjects';
import { getEnumValuesQuery } from '../../Const/Queries/getEnumValues';
import {
	ChartConfiguration,
	FetchChartDataParams,
	FetchChartKoefParams,
	FetchFormParametersParams,
	Trend,
} from '../../Shared/types';
import { checkResponseOutputWarnings } from '../../Utils/handleToast';
import { rpcQuery } from '../../Utils/requests';

import { ChartValue, OptionWithCoefficient } from './types';

export const fetchFormParametersFx = createEffect(
	async (params: FetchFormParametersParams) => {
		const chartParameters = await rpcQuery<Partial<ChartConfiguration>>(
			getFormParametersQuery(params),
			chartParametersAdapter,
			checkResponseOutputWarnings,
		);
		return { chartParameters };
	},
);

export const fetchChartDataFx = createEffect(
	async ({
		gr,
		startDateTime,
		endDateTime,
		isMoscowTimeZone,
		discrete,
		gtype,
		round,
		moduleName,
		multipleCount,
	}: FetchChartDataParams) => {
		const chartData = await rpcQuery<ChartValue[]>(
			getChartDataQuery({
				gr,
				startDateTime,
				endDateTime,
				isMoscowTimeZone,
				discrete,
				gtype,
				round,
				moduleName,
				multipleCount: Number(multipleCount),
			}),
			chartDataAdapter,
			checkResponseOutputWarnings,
		);
		return { chartData };
	},
);

export const fetchCurrChartKoefFx = createEffect(
	async (params: FetchChartKoefParams) => {
		const { unitId, unitName, methodName, isConsumption } = await rpcQuery<{
			unitId: number | null;
			unitName: string;
			methodName: string;
			isConsumption: boolean;
		}>(
			getChartCurrentKoef(params),
			currChartKoefAdapter,
			checkResponseOutputWarnings,
		);
		return { unitId, unitName, methodName, isConsumption };
	},
);

export const fetchChartKoefListFx = createEffect(async (unitId: number) => {
	const unitList = await rpcQuery<OptionWithCoefficient[]>(
		getKoefList(unitId),
		unitListAdapter,
		checkResponseOutputWarnings,
	);
	return { unitList };
});

export const fetchFormObjectsFx = createEffect(
	async ({ formId, versionCode }: { formId: number; versionCode: number }) => {
		const chartData = await rpcQuery<Trend[]>(
			getFormObjectsQuery(formId, versionCode),
			seriesAdapter,
		);
		return { chartData };
	},
);
export const getTypeGraphEnumValuesFx = createEffect(async () => {
	// id = 6 выдает список вида данных для графика
	const result = await rpcQuery(getEnumValuesQuery(6), getEnumValuesAdapter);

	return result;
});
