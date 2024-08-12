import { SelectOption } from '../../UI/Select/types';

export default interface ReportFormProps {
	className?: string;
}
export interface ReportForm {
	reportLink: string;
	kvitStatusList: SelectOption[];
	eventTypeList: SelectOption[];
	eventStatusList: SelectOption[];
	minDuration: number;
	reportPath: string;
	criterionsReportPath: string;
}
export const enum ReportActionType {
	UpdateList = 'updateList',
	SetFlag = 'setFlag',
	UpdateReportLink = 'updateReportLink',
	UpdateMinDurationValue = 'updateMinDurationValue',
	SetReportPath = 'setReportPath',
}
export type ReportActions =
	| {
			type: ReportActionType.UpdateList;
			payload: SelectOption[];
			listName: string;
	  }
	| { type: ReportActionType.SetFlag; flagName: string }
	| { type: ReportActionType.UpdateReportLink; payload: string }
	| { type: ReportActionType.UpdateMinDurationValue; payload: number }
	| {
			type: ReportActionType.SetReportPath;
			payload: string;
			reportName: string;
	  };
