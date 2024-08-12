import { createEvent, merge } from 'effector';

import {
	AcknowledgementStatusFilter,
	AssignedEmergencyEvent,
	EmergencyEventsTreeItem,
	EmergencyEventsReportTypes,
	ParameterCriterions,
	SortOptions,
} from '../../Shared/types';

import {
	createParameterCriterionFx,
	deleteParameterCriterionFx,
	editParameterCriterionFx,
	getEmergencyEventsTreeFx,
} from './effects';
import { ActiveEventInfo } from './types';

export const setTree = createEvent<EmergencyEventsTreeItem[]>();
export const setActiveNodeInfo = createEvent<EmergencyEventsTreeItem>();
export const setActiveNode = createEvent<number | undefined>();
export const setDatePeriod = createEvent<Date[]>();
export const rollupNodes = createEvent();
export const setParameterCriterions = createEvent<ParameterCriterions[]>();
export const handleQueryFails = merge([
	getEmergencyEventsTreeFx.fail,
	editParameterCriterionFx.fail,
	createParameterCriterionFx.fail,
	deleteParameterCriterionFx.fail,
]);
export const setEditMode = createEvent<boolean>();
export const setActiveRowIndex = createEvent<number>();
export const toggleNode = createEvent<number>();
export const setAssignedEmergencyEventsNumber = createEvent<number>();
export const setAssignedEmergencyEvents =
	createEvent<AssignedEmergencyEvent[]>();
export const setFilterDates = createEvent<[Date, Date]>();
export const setAcknowledgementStatus =
	createEvent<AcknowledgementStatusFilter>();
export const setAssignedEmergencyEventsSort = createEvent<SortOptions>();
export const setAssignedEventsCheckedIds = createEvent<number[]>();
export const setActiveEventId = createEvent<number>();
export const setActiveEventGroupInfo = createEvent<ActiveEventInfo>();
export const setActiveEventGroupNumber = createEvent<number>();
export const setReportType = createEvent<EmergencyEventsReportTypes>();
