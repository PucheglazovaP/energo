import { CalendarType } from '@evraz/ui-kit/dist/src/components/Calendar/types';

import { ChartValue } from '../../Shared/types';
import { SelectOption } from '../../UI/Select/types';

export default interface ColumnChartSectionProps {
	className?: string;
}
export interface ColumnChart {
	isMoscowTimeZone: boolean;
	startDateTime: Date;
	endDateTime: Date;
	updateDelay: number;
	isUpdateChartEnabled: boolean;
	discreteList: SelectOption[];
	isLoading: boolean;
	data: ChartValue[];
	selectedCalendarType: CalendarType;
	isChartVisible: boolean;
	reportPath: string;
}
export type ColumnChartActions =
	| { type: 'UPDATE_LIST'; payload: SelectOption[] }
	| {
			type: 'SET_UPDATE_DELAY';
			payload: number;
	  }
	| {
			type: 'SET_DATE_PERIOD';
			payload: Date[];
	  }
	| { type: 'SET_FLAG'; flagName: string }
	| { type: 'UPDATE_CHART_DATA'; payload: ChartValue[] }
	| { type: 'SET_CALENDAR_TYPE'; payload: CalendarType }
	| { type: 'SET_REPORT_PATH'; payload: string };
