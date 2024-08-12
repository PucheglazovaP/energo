import { format } from 'date-fns';
import subDays from 'date-fns/subDays';
import { createStore, sample } from 'effector';

import {
	AcknowledgementStatusFilter,
	AssignedEmergencyEvent,
	EmergencyEventsReportTypes,
	Role,
	SortOptions,
	SortOrder,
} from '../../Shared/types';
import { handleError } from '../../Utils/handleToast';
import { $roles, $user } from '../Auth';
import {
	assignResponsiblePersonsFx,
	changeAssignedResponsiblePersonFx,
	deleteParameterFx,
	saveNewParameterFx,
	saveParameterFx,
	unassginResponsiblePersonFx,
} from '../NewEmergencyEventParameter/effects';

import {
	acknowledgeAssignedEmergencyEventsFx,
	createParameterCriterionFx,
	deleteParameterCriterionFx,
	editParameterCriterionFx,
	fetchAssignedEmergencyEventsFx,
	fetchAssignedEmergencyEventsNumberFx,
	getEmergencyEventsTreeFx,
	getParameterCriterionsFx,
	moveParameterFx,
} from './effects';
import {
	handleQueryFails,
	rollupNodes,
	setAcknowledgementStatus,
	setActiveEventGroupInfo,
	setActiveEventGroupNumber,
	setActiveEventId,
	setActiveNode,
	setActiveNodeInfo,
	setActiveRowIndex,
	setAssignedEmergencyEvents,
	setAssignedEmergencyEventsNumber,
	setAssignedEmergencyEventsSort,
	setAssignedEventsCheckedIds,
	setDatePeriod,
	setEditMode,
	setFilterDates,
	setParameterCriterions,
	setReportType,
	setTree,
	toggleNode,
} from './events';
import { ActiveEventInfo, EmergencyEventsInfo } from './types';

export const $emergencyEventsInfo = createStore<EmergencyEventsInfo>({
	tree: [],
	activeNode: undefined,
	activeNodeInfo: undefined,
	startDateTime: new Date(),
	endDateTime: new Date(),
	isEditing: false,
	parameterCriterions: [],
	activeRowIndex: 0,
	selectedReportType: EmergencyEventsReportTypes.Events,
});
$emergencyEventsInfo.on(setTree, (state, tree) => ({
	...state,
	tree,
}));
$emergencyEventsInfo.on(setActiveNodeInfo, (state, info) => ({
	...state,
	activeNodeInfo: info ? { ...info } : undefined,
}));
$emergencyEventsInfo.on(setEditMode, (state, isEditing) => ({
	...state,
	isEditing: isEditing,
}));
$emergencyEventsInfo.on(setActiveNode, (state, selectedTreeItemId) => {
	return { ...state, activeNode: selectedTreeItemId };
});
$emergencyEventsInfo.on(setDatePeriod, (state, period) => {
	return {
		...state,
		startDateTime: period[0],
		endDateTime: period[1],
	};
});
$emergencyEventsInfo.on(rollupNodes, (state) => {
	const newTree = state.tree.map((node) => ({ ...node, isOpen: false }));
	return {
		...state,
		tree: newTree,
	};
});
$emergencyEventsInfo.on(setParameterCriterions, (state, criterions) => {
	return {
		...state,
		parameterCriterions: criterions,
	};
});
$emergencyEventsInfo.on(createParameterCriterionFx.doneData, (state) => ({
	...state,
	activeRowIndex: 0,
}));
$emergencyEventsInfo.on(setActiveRowIndex, (state, payload) => ({
	...state,
	activeRowIndex: payload,
}));
$emergencyEventsInfo.on(toggleNode, (state, id) => {
	const newTree = state.tree.map((item) => {
		if (item.id === id) {
			return { ...item, isOpen: !item.isOpen };
		}
		return item;
	});
	return {
		...state,
		tree: newTree,
	};
});
$emergencyEventsInfo.on(setReportType, (state, reportType) => {
	return {
		...state,
		selectedReportType: reportType,
	};
});
// <-- уведомление и таблица назначенных аварийных событий

export const $hasEmergencyConfirmRole = $roles.map((roles: Role[]) =>
	roles.includes(Role.EM_EMERGEVENTS_CONFIRM),
);
export const $assignedEmergencyEventsNumber = createStore<number>(0, {
	name: 'Number of assigned unacknowledged emergency events',
});
export const $assignedEmergencyEvents = createStore<AssignedEmergencyEvent[]>(
	[],
	{
		name: 'List of assigned emergency events',
	},
);
export const $assignedEventsCheckedIds = createStore<number[]>([], {
	name: 'Ids of assigned emergency events checked to be acknowledged',
});
export const $activeEventId = createStore<number>(0, {
	name: 'Id of selected assigned emergency event',
});
export const $activeEventGroupNumber = createStore<number>(0, {
	name: 'Group number of selected assigned emergency event',
});
export const $filterDates = createStore<[Date, Date]>(
	[
		new Date(`${format(subDays(new Date(), 1), 'yyyy.MM.dd')} 00:00:00`),
		new Date(),
	],
	{ name: 'Date range filter for assigned emergency events table' },
);
export const $filterAcknowledgmentStatus =
	createStore<AcknowledgementStatusFilter>(AcknowledgementStatusFilter.All, {
		name: 'Acknowledgement status filter for assigned emergency events table',
	});
export const $assignedEmergencyEventsSort = createStore<SortOptions>(
	{ accessor: '', order: SortOrder.None },
	{
		name: 'Sort state of assigned emergency events table',
	},
);

$filterDates.on(setFilterDates, (_state, dates: [Date, Date]) => dates);
$filterAcknowledgmentStatus.on(
	setAcknowledgementStatus,
	(_state, acknowledgementStatus: AcknowledgementStatusFilter) =>
		acknowledgementStatus,
);
$assignedEmergencyEventsSort.on(
	setAssignedEmergencyEventsSort,
	(_state, sortOption: SortOptions) => sortOption,
);
$assignedEventsCheckedIds.on(
	setAssignedEventsCheckedIds,
	(_state, checkedIds: number[]) => checkedIds,
);
$activeEventId.on(setActiveEventId, (_state, eventId: number) => eventId);
$activeEventGroupNumber.on(
	setActiveEventGroupNumber,
	(_state, eventGroupNumber: number) => eventGroupNumber,
);
export const $activeEventInfo = createStore<ActiveEventInfo>(
	{
		groupNumber: null,
		maxSetpoint: null,
		minSetpoint: null,
		name: '',
		unitName: '',
		multipleCount: 0,
		gtype: 1,
	},
	{
		name: 'Group info for chart',
	},
);
$activeEventInfo.on(setActiveEventGroupInfo, (_state, info) => ({
	...info,
}));
// --> уведомление и таблица назначенных аварийных событий

$assignedEmergencyEvents.on(
	setAssignedEmergencyEvents,
	(_state, assignedEvents: AssignedEmergencyEvent[]) => assignedEvents,
);
$assignedEmergencyEventsNumber.on(
	setAssignedEmergencyEventsNumber,
	(_state, payload: number) => payload,
);

sample({
	clock: acknowledgeAssignedEmergencyEventsFx.done,
	source: {
		user: $user,
	},
	fn: ({ user }) => {
		if (user) {
			fetchAssignedEmergencyEventsNumberFx({
				userId: user.preferredUsername,
			});
		}
	},
});

sample({
	clock: fetchAssignedEmergencyEventsNumberFx.doneData,
	target: setAssignedEmergencyEventsNumber,
});
sample({
	clock: fetchAssignedEmergencyEventsFx.doneData,
	target: setAssignedEmergencyEvents,
});
sample({
	clock: getEmergencyEventsTreeFx.doneData,
	target: setTree,
});
sample({
	clock: setTree,
	source: $emergencyEventsInfo,
	filter: (sourceData) => {
		return sourceData.activeNode == undefined;
	},
	fn: (_sourceData, newTree) => {
		if (newTree.length > 0) {
			return newTree[0].id;
		}
		return undefined;
	},
	target: setActiveNode,
});
sample({
	clock: getParameterCriterionsFx.doneData,
	target: setParameterCriterions,
});
$emergencyEventsInfo.watch(handleQueryFails, (_state, { error }) => {
	handleError(error);
});
sample({
	clock: [editParameterCriterionFx.doneData],
	source: $emergencyEventsInfo,
	fn: (sourceData) => {
		const { activeNode } = sourceData;
		return activeNode || 0;
	},
	target: getParameterCriterionsFx,
});
sample({
	clock: [createParameterCriterionFx.doneData],
	source: $emergencyEventsInfo,
	fn: (sourceData) => {
		const { activeNode } = sourceData;
		return activeNode || 0;
	},
	target: getParameterCriterionsFx,
});
sample({
	clock: [deleteParameterCriterionFx.doneData],
	source: $emergencyEventsInfo,
	fn: (sourceData) => {
		const { activeNode } = sourceData;
		return activeNode || 0;
	},
	target: getParameterCriterionsFx,
});
sample({
	clock: [moveParameterFx.done],
	target: getEmergencyEventsTreeFx,
});
$emergencyEventsInfo.on(deleteParameterFx.done, (state, { params }) => {
	const { id } = params;
	return {
		...state,
		tree: state.tree.filter((item) => item.id !== id),
	};
});

sample({
	clock: [
		unassginResponsiblePersonFx.done,
		assignResponsiblePersonsFx.done,
		changeAssignedResponsiblePersonFx.done,
		saveNewParameterFx.done,
		saveParameterFx.done,
	],
	target: getEmergencyEventsTreeFx,
});
