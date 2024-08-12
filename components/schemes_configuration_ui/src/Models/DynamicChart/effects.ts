/* eslint-disable no-undef */
import { createEffect } from 'effector';

import { currChartKoefAdapter } from '../../Adapters/chart/chartDataAdapter';
import { chartDataAdapter } from '../../Adapters/formDataAdapter';
import {
	getChartCurrentKoef,
	getChartDataQuery,
} from '../../Const/Queries/chart';
import {
	ChartValue,
	FetchChartDataParams,
	FetchChartKoefParams,
} from '../../Shared/types';
import {
	checkResponseOutputWarnings,
	handleError,
} from '../../Utils/handleToast';
import { rpcQuery } from '../../Utils/requests';

import { setDynamicChartParameters } from './events';

function handleErrorResponse({ error }: { error: Error }) {
	handleError(error);
	setDynamicChartParameters({ isLoading: false });
}

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
			}),
			chartDataAdapter,
			checkResponseOutputWarnings,
		);
		return { chartData };
	},
);

fetchChartDataFx.fail.watch(handleErrorResponse);

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

fetchCurrChartKoefFx.fail.watch(handleErrorResponse);
