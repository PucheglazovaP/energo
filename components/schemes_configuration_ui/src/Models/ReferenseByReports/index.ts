import { createStore, sample } from 'effector';

import { EditReportItemParams, EditReportParams } from '../../Shared/types';
import { ModuleName } from '../../Shared/Types/moduleName';
import { deleteReportFx } from '../Reports/effects';

import {
	setEditReportData,
	setEditReportItemData,
	setReportContextMenuId,
	setReportItemContextMenuId,
	setSelectedReportId,
	toggleIsOpenSidePanel,
} from './events';

export const INITIAL_REPORT_DATA: EditReportParams = {
	name: '',
	comment: '',
	userId: '',
	moduleName: ModuleName.UseEditReferenceByReportForm_saveReportFx,
};

export const INITIAL_REPORT_ITEM_DATA: EditReportItemParams = {
	id: 0,
	positionName: '',
	reportPositionNumber: '',
	isCalculated: null,
	pointId: null,
	coefficient: 0,
	activeFrom: null,
	activeTo: null,
	userId: '',
	moduleName: ModuleName.UseEditReportItem_editReportItemFx,
};

export const $isOpenSidePanel = createStore<boolean>(true);

$isOpenSidePanel.on(toggleIsOpenSidePanel, (state) => {
	return !state;
});

export const $selectedReportId = createStore<number | null>(null);

$selectedReportId.on(setSelectedReportId, (state, payload) => {
	return payload;
});

// id точки для вызова контекстного меню бокового меню
export const $reportContextMenuId = createStore<number>(0);
$reportContextMenuId.on(setReportContextMenuId, (state, payload) => payload);

// Данные отчета для редактирования
export const $editReportData =
	createStore<EditReportParams>(INITIAL_REPORT_DATA);

$editReportData.on(setEditReportData, (state, payload) => payload);

export const $editReportItemData = createStore<EditReportItemParams>(
	INITIAL_REPORT_ITEM_DATA,
);

$editReportItemData.on(setEditReportItemData, (state, payload) => payload);

// id точки для вызова контекстного меню бокового меню
export const $reportItemContextMenuId = createStore<number>(0);
$reportItemContextMenuId.on(
	setReportItemContextMenuId,
	(state, payload) => payload,
);

sample({
	clock: deleteReportFx.doneData,
	fn: () => {
		return null;
	},
	target: $selectedReportId,
});
