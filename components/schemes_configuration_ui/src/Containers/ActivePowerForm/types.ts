export default interface ActivePowerFormProps {
	className?: string;
}
export interface ReportForm {
	date: Date;
	reportLink: string;
	isMoscowTimeZone: boolean;
	reportPath: string;
}
export type ReportActions =
	| {
			type: 'SET_DATE_PERIOD';
			payload: Date[];
	  }
	| { type: 'SET_FLAG'; flagName: string }
	| { type: 'UPDATE_REPORT_LINK'; payload: string }
	| { type: 'SET_REPORT_PATH'; payload: string };
