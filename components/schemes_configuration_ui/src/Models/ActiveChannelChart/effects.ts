/* eslint-disable no-undef */
import { createEffect } from 'effector';

import channelsChartDataAdapter from '../../Adapters/chart/channelsChartDataAdapter';
import { unitListAdapter } from '../../Adapters/chart/chartDataAdapter';
import { getKoefList } from '../../Const/Queries';
import { getChannelsChartDataQuery } from '../../Const/Queries/channels';
import { ChannelsChartDataParams, ChartValue } from '../../Shared/types';
import { checkResponseOutputWarnings } from '../../Utils/handleToast';
import { rpcQuery } from '../../Utils/requests';

import {
	ChartValueWithStatus,
	FetchChartKoefListParams,
	OptionWithCoefficient,
} from './types';

export const fetchChannelsChartDataFx = createEffect(
	async (params: ChannelsChartDataParams) => {
		const { chartData, channelsData } = await rpcQuery<{
			chartData: Map<number, ChartValue[]>;
			channelsData: ChartValueWithStatus[];
		}>(getChannelsChartDataQuery(params), channelsChartDataAdapter);
		return { chartData, channelsData };
	},
);

export const fetchChartKoefListFx = createEffect(
	async ({ unitId }: FetchChartKoefListParams) => {
		const unitList = await rpcQuery<OptionWithCoefficient[]>(
			getKoefList(unitId),
			unitListAdapter,
			checkResponseOutputWarnings,
		);
		return unitList;
	},
);
