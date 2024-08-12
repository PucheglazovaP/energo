import { ChartValue } from '../../Shared/types';

export interface ChartState {
	isLoading: boolean;
	data: ChartValue[];
	startDateTime: Date;
	endDateTime: Date;
}
export enum ChartActionsType {
	SetFlag = 'SET_FLAG',
	UpdateChartData = 'UPDATE_CHART_DATA',
	SetDatePeriod = 'SET_DATE_PERIOD',
}
export type ChartActions =
	| { type: ChartActionsType.SetFlag; flagName: string }
	| { type: ChartActionsType.UpdateChartData; payload: ChartValue[] }
	| { type: ChartActionsType.SetDatePeriod; payload: Date[] };

export default interface ChartSectionProps {
	className?: string;
}
