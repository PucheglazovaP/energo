import { createEffect } from 'effector';

import {
	channelsChartDataAdapter,
	chartParametersAdapter,
	volumeOfMergedCondensateDataAdapter,
} from '../../Adapters/chart/condensateDrainAdapter';
import {
	getChannelsChartDataQuery,
	getVolumeOfMergedCondensate,
} from '../../Const/Queries/channels';
import { getFormParametersQuery } from '../../Const/Queries/form';
import {
	ChannelsChartDataParams,
	FetchFormParametersParams,
	VolumeOfMergedCondensate,
} from '../../Shared/types';
import { checkResponseOutputWarnings } from '../../Utils/handleToast';
import { rpcQuery } from '../../Utils/requests';

import { ActiveChart, ChartValue } from './types';

export const fetchFormParametersFx = createEffect(
	async (params: FetchFormParametersParams) => {
		const chartParameters = await rpcQuery<Partial<ActiveChart>>(
			getFormParametersQuery(params),
			chartParametersAdapter,
			checkResponseOutputWarnings,
		);
		return chartParameters;
	},
);

export const fetchChannelsChartDataFx = createEffect(
	async (params: ChannelsChartDataParams) => {
		const chartData = await rpcQuery<ChartValue[]>(
			getChannelsChartDataQuery(params),
			channelsChartDataAdapter,
		);
		return chartData;
	},
);
export const fetchVolumeOfMergedCondensateFx = createEffect(
	async (params: ChannelsChartDataParams) => {
		const chartData = await rpcQuery<VolumeOfMergedCondensate[]>(
			getVolumeOfMergedCondensate(params),
			volumeOfMergedCondensateDataAdapter,
		);
		return chartData;
	},
);
