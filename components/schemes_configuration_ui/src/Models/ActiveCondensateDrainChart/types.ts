import { FormTypes, Trend, VolumeOfMergedCondensate } from '../../Shared/types';
import { SelectOption } from '../../UI/Select/types';
import { ITableColumn } from '../../UI/Table/types';

export type ChartValue = {
	date: string;
	value: number;
};

export type ChannelsChartValue = {
	date: string;
	value: number;
	code: number;
};

export interface OptionWithCoefficient extends SelectOption {
	coefficient: number;
}
export type ActiveChart = {
	id: number | null;
	isTitleVisible: boolean;
	title: string;
	formType: FormTypes;
	isLoading: boolean;
	channelsChartData: Trend[];
	tableHeader: ITableColumn[];
	startDateTime: Date;
	endDateTime: Date;
	discreteList: SelectOption[];
	round: number;
	versionCode: number;
	vertAxisName: string;
	channelNumber: number | null;
	volumeOfMergedCondensate: VolumeOfMergedCondensate[];
};

export type ChartDataResponse = {
	dat: string;
	dan: number;
};
