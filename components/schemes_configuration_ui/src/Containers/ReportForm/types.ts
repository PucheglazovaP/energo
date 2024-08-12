import { CalendarType } from '@evraz/ui-kit/dist/src/components/Calendar/types';

import { SelectOption } from '../../UI/Select/types';

export default interface ReportFormProps {
	className?: string;
}
export interface ReportForm {
	startDateTime: Date;
	endDateTime: Date;
	discreteList: SelectOption[];
	selectedCalendarType: CalendarType;
	reportLink: string;
	reportPath: string;
}
export type ReportActions =
	| { type: 'UPDATE_LIST'; payload: SelectOption[] }
	| {
			type: 'SET_DATE_PERIOD';
			payload: Date[];
	  }
	| { type: 'SET_FLAG'; flagName: string }
	| { type: 'SET_CALENDAR_TYPE'; payload: CalendarType }
	| { type: 'UPDATE_REPORT_LINK'; payload: string }
	| { type: 'SET_REPORT_PATH'; payload: string };
