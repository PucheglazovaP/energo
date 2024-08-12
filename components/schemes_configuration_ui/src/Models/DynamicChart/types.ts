import { SortDirectionType } from 'react-virtualized';

import { FormTypes, Trend } from '../../Shared/types';
import { SelectOption } from '../../UI/Select/types';
import { ITableColumn } from '../../UI/Table/types';

export type DynamicChart = {
	formType: FormTypes;
	isLoading: boolean;
	chartData: Trend[];
	tableHeader: ITableColumn[];
	isMoscowTimeZone: boolean;
	startDateTime: Date;
	endDateTime: Date;
	isUpdateChartEnabled: boolean;
	updateDelay: number;
	isMultiYaxesEnabled: boolean;
	discreteList: SelectOption[];
	isRelativeZeroEnabled: boolean;
	isTimeWithoutDataEnabled: boolean;
	dateColumnSortDirection: SortDirectionType;
};

export type ChartDataResponse = {
	dat: string;
	dan: number;
};
