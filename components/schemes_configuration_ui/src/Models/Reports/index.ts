import { createStore, sample } from 'effector';

import { setSelectedReportId } from '../ReferenseByReports/events';

import { deleteReportFx, fetchReportsListFx, saveReportFx } from './effects';
import { setReportsList } from './events';
import { Report } from './types';

export const $reports = createStore<Report[]>([]);

$reports.on(setReportsList, (_state, data) => {
	return data;
});

sample({
	clock: fetchReportsListFx.doneData,
	target: setReportsList,
});

// Установка первого элемента списка активным при загрузке
sample({
	clock: setReportsList,
	source: $reports,
	filter: (clk) => clk.length > 0,
	fn: (clk) => {
		return clk[0].id;
	},
	target: setSelectedReportId,
});

sample({
	clock: [saveReportFx.doneData, deleteReportFx.doneData],
	target: fetchReportsListFx,
});
