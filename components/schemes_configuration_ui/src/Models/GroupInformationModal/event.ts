import { createEvent } from 'effector';

import { GroupComponentsTree } from '../../Shared/types';
export const setModalInfo = createEvent<{
	groupId: number;
	groupName: string;
	unitName: string;
	unitId: number;
}>();
export const setGroupFormulaModalOpen = createEvent<boolean>();
export const setChannelChartModalOpen = createEvent<boolean>();
export const getInfoForGroup = createEvent<{
	groupNumber: number;
	delay: number;
}>();
export const setFormulaList = createEvent<string>();
export const setGroupInformation = createEvent<GroupComponentsTree[]>();
