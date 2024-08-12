import { OptionWithCoefficient } from '../../Models/ActiveChart/types';
import { ChartValue } from '../../Shared/types';
import { SelectOption } from '../../UI/Select/types';

export default interface ChartComparisonProps {
	className?: string;
}
export type ComparisonChartData = {
	data: ChartValue[];
	startDateTime: Date;
	endDateTime: Date;
	color: string;
	isVisibleOnChart: boolean;
	id: string;
};

export interface ComparisonChart {
	isMoscowTimeZone: boolean;
	discreteList: SelectOption[];
	unitList: OptionWithCoefficient[];
	isLoading: boolean;
	chartsData: ComparisonChartData[];
	isRelativeZeroEnabled: boolean;
	isTimeWithoutDataEnabled: boolean;
	isSumColumnVisible: boolean;
}
export enum ChartActionsType {
	UpdateDiscreteList = 'UPDATE_DISCRETE_LIST',
	UpdateUnitList = 'UPDATE_UNIT_LIST',
	SetFlag = 'SET_FLAG',
	UpdateChartData = 'UPDATE_CHART_DATA',
	ResetChartData = 'RESET_CHART_DATA',
	SetTrendVisibleState = 'SET_TREND_VISIBLE_STATE',
}

export type ComparisonChartActions =
	| { type: ChartActionsType.UpdateDiscreteList; payload: SelectOption[] }
	| { type: ChartActionsType.UpdateUnitList; payload: OptionWithCoefficient[] }
	| { type: ChartActionsType.SetFlag; flagName: string; value: boolean }
	| {
			type: ChartActionsType.UpdateChartData;
			payload: ComparisonChartData;
	  }
	| { type: ChartActionsType.ResetChartData }
	| { type: ChartActionsType.SetTrendVisibleState; payload: string };

// проблема с экспортом енумов в рантайме
export enum RegisteredModals {
	TransitionTree = 'TransitionTree',
	SelectGroup = 'SelectGroup',
	CreateNewForm = 'CreateNewForm',
	NewImageWarning = 'NewImageWarning',
	DynamicChart = 'DynamicChart',
	ConfirmFormDeletion = 'ConfirmDeletion',
	HistogramChart = 'HistogramChart',
	DynamicObjectImages = 'DynamicObjectImages',
	ImagesCollection = 'ImagesCollection',
	CompareWithPeriods = 'CompareWithPeriods',
	PeriodsList = 'PeriodsList',
	CreateReport = 'CreateReport',
}
