import { createStore, merge, sample } from 'effector';

import { handleError } from '../../Utils/handleToast';

import {
	fetchChannelsChartDataFx,
	fetchChartKoefListFx,
	getFormulaListFx,
	getGroupInformationFx,
} from './effects';
import {
	getInfoForGroup,
	setChannelChartModalOpen,
	setFormulaList,
	setGroupFormulaModalOpen,
	setGroupInformation,
	setModalInfo,
} from './event';
import { GroupInformationModal } from './types';

export const $groupInformationModal = createStore<GroupInformationModal>({
	modalInfo: {
		groupId: null,
		groupName: '',
		unitName: '',
		unitId: 0,
	},
	groupFormula: '',
	isGroupFormulaModalOpen: false,
	isChannelChartModalOpen: false,
	groupInformation: [],
});
$groupInformationModal.on(setModalInfo, (state, payload) => ({
	...state,
	modalInfo: {
		...payload,
	},
}));
$groupInformationModal.on(setGroupFormulaModalOpen, (state, payload) => ({
	...state,
	isGroupFormulaModalOpen: payload,
}));
$groupInformationModal.on(setChannelChartModalOpen, (state, payload) => ({
	...state,
	isChannelChartModalOpen: payload,
}));
$groupInformationModal.on(setFormulaList, (state, payload) => ({
	...state,
	groupFormula: payload,
}));
$groupInformationModal.on(setGroupInformation, (state, payload) => ({
	...state,
	groupInformation: payload,
}));
$groupInformationModal.watch(getInfoForGroup, (state, payload) => {
	const { groupNumber, delay } = payload;
	getFormulaListFx(groupNumber);
	getGroupInformationFx({ groupNumber, delay });
});
sample({
	clock: getFormulaListFx.done,
	fn: (clockData) => {
		const { result } = clockData;
		return result;
	},
	target: setFormulaList,
});
sample({
	clock: getGroupInformationFx.done,
	fn: (clockData) => {
		const { result } = clockData;
		return result;
	},
	target: setGroupInformation,
});
const handleActiveChartFails = merge([
	getGroupInformationFx.fail,
	getFormulaListFx.fail,
	fetchChannelsChartDataFx.fail,
	fetchChartKoefListFx.fail,
]);
$groupInformationModal.watch(handleActiveChartFails, (_state, { error }) => {
	handleError(error);
});
