import {
	EmergencyEventsReportTypes,
	EmergencyEventsTreeItem,
	ParameterCriterions,
} from '../../Shared/types';

export type EmergencyEventsInfo = {
	tree: EmergencyEventsTreeItem[];
	activeNode: number | undefined;
	activeNodeInfo: EmergencyEventsTreeItem | undefined;
	startDateTime: Date;
	endDateTime: Date;
	isEditing: boolean;
	parameterCriterions: ParameterCriterions[];
	activeRowIndex: number;
	selectedReportType: EmergencyEventsReportTypes;
};
export type ActiveEventInfo = {
	groupNumber: number | null;
	maxSetpoint: number | null;
	minSetpoint: number | null;
	name: string;
	unitName: string;
	multipleCount?: number;
	gtype?: number;
};
