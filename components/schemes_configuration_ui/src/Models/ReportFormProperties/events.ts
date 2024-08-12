import { createEvent } from 'effector';

import { GroupListItem } from '../HardwareGroup/types';

import { GroupsInReportForm } from './types';

export const setGroupsInReportForm = createEvent<GroupsInReportForm[]>();
export const moveGroup = createEvent<{
	from: number;
	to: number;
}>();
export const selectGroupInReportForm = createEvent<{
	groupNumber: number;
	isChecked: boolean;
}>();
export const selectAllGroupsInReportForm = createEvent();
export const selectGroup = createEvent<{
	groupItem: GroupListItem;
	isChecked: boolean;
}>();
export const removeSelectedGroupList = createEvent();
export const removeSelectedGroupListInReportForm = createEvent();

export const resetReportFormProperties = createEvent();
