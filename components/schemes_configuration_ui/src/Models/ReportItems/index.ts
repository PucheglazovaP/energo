import { createStore, sample } from 'effector';

import { User } from '../../Shared/types';
import { ModuleName } from '../../Shared/Types/moduleName';
import { $user } from '../Auth';
import { $selectedReportId } from '../ReferenseByReports';

import {
	createReportItemFx,
	deleteReportItemFx,
	editReportItemFx,
	fetchReportItemsListFx,
	moveReportItemFx,
} from './effects';
import {
	onCloseReportItems,
	onToggleReportItem,
	setReportItemsList,
} from './events';
import { ReportItem } from './types';

export const $reportItems = createStore<ReportItem[]>([]);

$reportItems
	.on(setReportItemsList, (_state, data) => {
		return data;
	})
	.on(onToggleReportItem, (state, payload) => {
		return state.map((item) =>
			item.id === payload ? { ...item, isOpen: !item.isOpen } : item,
		);
	})
	.on(onCloseReportItems, (state) => {
		return state.map((item) => ({ ...item, isOpen: false }));
	});

sample({
	clock: fetchReportItemsListFx.doneData,
	target: setReportItemsList,
});

sample({
	clock: [
		createReportItemFx.doneData,
		editReportItemFx.doneData,
		moveReportItemFx.doneData,
		deleteReportItemFx.doneData,
	],
	source: [$selectedReportId, $user],
	fn: (source) => {
		const [id, user] = source as [number, User];
		return {
			id,
			userId: user.preferredUsername,
			moduleName:
				ModuleName.Move_save_edit_deleteReportItem_sample_fetchPointsListFx,
		};
	},
	target: fetchReportItemsListFx,
});
