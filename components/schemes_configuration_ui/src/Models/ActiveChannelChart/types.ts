import { SortDirectionType } from 'react-virtualized';

import { ChartValue, FormTypes, Trend } from '../../Shared/types';
import { SelectOption } from '../../UI/Select/types';
import { ITableColumn } from '../../UI/Table/types';

export interface OptionWithCoefficient extends SelectOption {
	coefficient: number;
}
export interface ChartValueWithStatus extends ChartValue {
	status: string;
}
export interface OptionWithSecondsValue extends SelectOption {
	secondsValue?: number;
}
export type ActiveChannelChart = {
	id: number | null;
	title: string;
	formType: FormTypes;
	chartData: Trend[];
	tableHeader: ITableColumn[];
	isMoscowTimeZone: boolean;
	startDateTime: Date;
	endDateTime: Date;
	isUpdateChartEnabled: boolean;
	updateDelay: number;
	discreteList: OptionWithSecondsValue[];
	isMultiYaxesEnabled: boolean;
	methodName: string;
	typeStorage: string | null;
	round: number;
	isLoading: boolean;
	showOverperiodData: boolean;
	isTimeWithoutDataEnabled: boolean;
	isRelativeZeroEnabled: boolean;
	isArchiveModeEnabled: boolean;
	versionCode: number;
	isConsumption: boolean;
	unitList: OptionWithCoefficient[];
	dateColumnSortDirection: SortDirectionType;
	channelsData: ChartValueWithStatus[];
};

export type ChartSettingsModel = Pick<
	ActiveChannelChart,
	'isMoscowTimeZone' | 'startDateTime' | 'endDateTime' | 'discreteList'
>;

export type ChartDataResponse = {
	dat: string;
	dan: number;
};
export type FetchChartKoefListParams = {
	unitId: number;
	unitName: string;
};
