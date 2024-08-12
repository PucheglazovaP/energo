import { SortDirectionType } from 'react-virtualized';

import { FormTypes, Trend, TypesStorage } from '../../Shared/types';
import { SelectOption } from '../../UI/Select/types';
import { ITableColumn } from '../../UI/Table/types';

export interface ChartValue {
	date: string;
	value: number;
}

export type ChannelsChartValue = {
	date: string;
	value: number;
	code: number;
};

export interface OptionWithCoefficient extends SelectOption {
	coefficient: number;
}
export interface OptionWithSecondsValue extends SelectOption {
	secondsValue?: number;
}
export type ActiveChart = {
	id: number | null;
	parentId?: number;
	isTitleVisible: boolean;
	title: string;
	visdelayForm: number;
	formType: FormTypes;
	asqlUser: number;
	asqlGroup: number;
	asqlType: number;
	useCapt: boolean;
	hlineVisible: boolean;
	hlineValue: number;
	hlineColor: string;
	hlineWidth: number;
	hlineVisible1: boolean;
	hlineValue1: number;
	hlineColor1: string;
	hlineWidth1: number;
	hlineVisible2: boolean;
	hlineValue2: number;
	hlineColor2: string;
	hlineWidth2: number;
	asqlGroupName: string | null;
	asqlUserName: string | null;
	asqlTypeName: string | null;
	isLoading: boolean;
	trendMode: string;
	chartData: Trend[];
	tableHeader: ITableColumn[];
	isMoscowTimeZone: boolean;
	startDateTime: Date;
	endDateTime: Date;
	isUpdateChartEnabled: boolean;
	updateDelay: number;
	unitList: OptionWithCoefficient[];
	discreteList: OptionWithSecondsValue[];
	isMultiYaxesEnabled: boolean;
	methodName: string;
	round: number;
	showOverperiodData: boolean;
	isTimeWithoutDataEnabled: boolean;
	isRelativeZeroEnabled: boolean;
	isArchiveModeEnabled: boolean;
	versionCode: number;
	isConsumption: boolean;
	typeGraph: number;
	typesStorage: TypesStorage;
	multipleCount: boolean;
	typeGraphList: SelectOption[];
	dateColumnSortDirection: SortDirectionType;
};

export type FormBackground = {
	image: string;
	fileName: string;
};
export type ChartDataResponse = {
	dat: string;
	dan: number;
};
