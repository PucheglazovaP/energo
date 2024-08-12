import { createEffect } from 'effector';

import channelsChartDataAdapter from '../../Adapters/chart/channelsChartDataAdapter';
import { unitListAdapter } from '../../Adapters/chart/chartDataAdapter';
import {
	formulaFromDBAdapter,
	groupComponentsTreeAdapter,
} from '../../Adapters/groupInformationAdapter';
import { getKoefList } from '../../Const/Queries';
import { getChannelsChartDataQuery } from '../../Const/Queries/channels';
import {
	getFormulaListQuery,
	getGroupComponentsTreeQuery,
} from '../../Const/Queries/formula';
import {
	ChannelsChartDataParams,
	ChartValue,
	GroupComponentsTree,
} from '../../Shared/types';
import { checkResponseOutputWarnings } from '../../Utils/handleToast';
import { rpcQuery } from '../../Utils/requests';
import { ChartValueWithStatus } from '../ActiveChannelChart/types';
import { OptionWithCoefficient } from '../ActiveChart/types';

export const getFormulaListFx = createEffect(async (groupNumber: number) => {
	const formula = await rpcQuery<string>(
		getFormulaListQuery(groupNumber),
		formulaFromDBAdapter,
	);
	return formula;
});
export const getGroupInformationFx = createEffect(
	async ({ groupNumber, delay }: { groupNumber: number; delay: number }) => {
		const groupComponentsTree = await rpcQuery<GroupComponentsTree[]>(
			getGroupComponentsTreeQuery(groupNumber, delay),
			groupComponentsTreeAdapter,
		);
		return groupComponentsTree;
	},
);

export const fetchChannelsChartDataFx = createEffect(
	async (params: ChannelsChartDataParams) => {
		const { chartData, channelsData } = await rpcQuery<{
			chartData: Map<number, ChartValue[]>;
			channelsData: ChartValueWithStatus[];
		}>(getChannelsChartDataQuery(params), channelsChartDataAdapter);
		return { chartData, channelsData };
	},
);

export const fetchChartKoefListFx = createEffect(async (unitId: number) => {
	const unitList = await rpcQuery<OptionWithCoefficient[]>(
		getKoefList(unitId),
		unitListAdapter,
		checkResponseOutputWarnings,
	);
	return unitList;
});
