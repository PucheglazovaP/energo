import { GroupListItem } from '../HardwareGroup/types';

export type ReportFormProperties = {
	groupsInReportForm: GroupsInReportForm[];
	selectedGroups: GroupListItem[];
	selectedGroupsInReportForm: GroupsInReportForm[];
};
export type GroupsInReportForm = {
	name: string;
	groupNumber: number;
	order: number;
};
