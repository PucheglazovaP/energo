import { combine, createStore } from 'effector';

import { setEditMode } from '../EditMode/events';
import { $editModeSettings } from '../EditModeSettings';
import { $groups } from '../HardwareGroup';

import { getReportFormGroupListFx } from './effects';
import {
	moveGroup,
	removeSelectedGroupList,
	removeSelectedGroupListInReportForm,
	resetReportFormProperties,
	selectAllGroupsInReportForm,
	selectGroup,
	selectGroupInReportForm,
	setGroupsInReportForm,
} from './events';
import { ReportFormProperties } from './types';

export const $reportFormProperties = createStore<ReportFormProperties>({
	groupsInReportForm: [],
	selectedGroups: [],
	selectedGroupsInReportForm: [],
});

export const $reportForm = combine(
	$reportFormProperties,
	$editModeSettings,
	$groups,
	(reportFormProperties, editModeSettings, devices) => {
		const { formType, activeId } = editModeSettings;
		const { groupsInReportForm, selectedGroups, selectedGroupsInReportForm } =
			reportFormProperties;
		return {
			formType,
			formId: activeId,
			groupsInReportForm,
			selectedGroups,
			devices,
			selectedGroupsInReportForm,
		};
	},
);

getReportFormGroupListFx.done.watch(({ result }) => {
	const groupsInReportForm = result;
	setGroupsInReportForm(groupsInReportForm);
});

$reportFormProperties.on(
	setGroupsInReportForm,
	(state, groupsInReportForm) => ({
		...state,
		groupsInReportForm,
	}),
);

$reportFormProperties.on(moveGroup, (state, payload) => {
	const { from, to } = payload;
	const { groupsInReportForm } = state;
	const groupsInReportFormCopy = [...groupsInReportForm];
	const movedGroup = groupsInReportFormCopy.splice(from, 1)[0];
	groupsInReportFormCopy.splice(to, 0, movedGroup);
	const updatedGroupsInReportForm = groupsInReportFormCopy.map(
		(group, idx) => ({
			...group,
			order: idx + 1,
		}),
	);
	return {
		...state,
		groupsInReportForm: updatedGroupsInReportForm,
	};
});

$reportFormProperties.on(selectGroupInReportForm, (state, payload) => {
	const { groupNumber, isChecked } = payload;
	const { selectedGroupsInReportForm, groupsInReportForm } = state;
	if (!isChecked)
		return {
			...state,
			selectedGroupsInReportForm: selectedGroupsInReportForm.filter(
				(item) => item.groupNumber !== groupNumber,
			),
		};
	else {
		const selectedGroup = groupsInReportForm.find(
			(item) => item.groupNumber === groupNumber,
		);
		if (selectedGroup)
			return {
				...state,
				selectedGroupsInReportForm: [
					...selectedGroupsInReportForm,
					selectedGroup,
				],
			};
	}
});
$reportFormProperties.on(selectGroup, (state, payload) => {
	const { groupItem, isChecked } = payload;
	const { selectedGroups } = state;
	if (!isChecked)
		return {
			...state,
			selectedGroups: selectedGroups.filter(
				(item) => item.number !== groupItem.number,
			),
		};
	else {
		return {
			...state,
			selectedGroups: [...selectedGroups, groupItem],
		};
	}
});
$reportFormProperties.on(removeSelectedGroupList, (state) => {
	return {
		...state,
		selectedGroups: [],
	};
});
$reportFormProperties.on(removeSelectedGroupListInReportForm, (state) => {
	return {
		...state,
		selectedGroupsInReportForm: [],
	};
});
$reportFormProperties.on(selectAllGroupsInReportForm, (state) => {
	return {
		...state,
		selectedGroupsInReportForm:
			state.selectedGroupsInReportForm.length > 0
				? []
				: [...state.groupsInReportForm],
	};
});
$reportFormProperties.reset(resetReportFormProperties);

$reportFormProperties.watch(setEditMode, (state, isEditing) => {
	if (!isEditing) {
		resetReportFormProperties();
	}
});
