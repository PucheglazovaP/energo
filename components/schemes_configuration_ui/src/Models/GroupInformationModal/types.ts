import { GroupComponentsTree } from '../../Shared/types';

export type GroupInformationModal = {
	modalInfo: {
		groupId: number | null;
		groupName: string;
		unitName: string;
		unitId: number;
	};
	isGroupFormulaModalOpen: boolean;
	isChannelChartModalOpen: boolean;
	groupFormula: string;
	groupInformation: GroupComponentsTree[];
};
