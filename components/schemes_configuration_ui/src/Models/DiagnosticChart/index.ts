import { format } from 'date-fns';
import { createStore, sample } from 'effector';

import { FetchDiagnosticChartParams } from '../../Shared/types';
import { getTodayDates } from '../../Utils/dateUtils';
import $diagnosticCurrentModel from '../DiagnosticCurrent';
import { setSelectedDeviceIdEvent } from '../DiagnosticCurrent/events';

import { fetchDiagnosticChartFx } from './effects';
import { addShapes, setDates } from './events';
import { AddShapeFnParams, DiagnosticChartModel } from './types';

const initState: DiagnosticChartModel = {
	shapes: new Map(),
	dates: getTodayDates(),
};

export const $diagnosticChart = createStore(initState);

$diagnosticChart.on(setDates, (state, dates) => ({
	...state,
	dates: dates as [Date, Date],
}));

$diagnosticChart.on(addShapes, (state, payload) => {
	const { id, shape } = payload;
	const newShapes = new Map(state.shapes);
	newShapes.set(id, shape);
	return {
		...state,
		shapes: newShapes,
	};
});

/* DECLARATIVES */

// Fetch diagnostic shape when device id of the diagnostic form is changed
sample({
	clock: setSelectedDeviceIdEvent,
	source: $diagnosticChart,
	fn: (sourceData, clockData) => {
		const [fromDate, toDate] = sourceData.dates;
		return {
			deviceId: clockData,
			fromDate: format(fromDate, 'yyyy-MM-dd HH:mm:ss'),
			toDate: format(toDate, 'yyyy-MM-dd HH:mm:ss'),
		};
	},
	target: fetchDiagnosticChartFx,
});

// Fetch diagnostic shape when date is changed on the chart section
sample({
	clock: setDates,
	source: $diagnosticCurrentModel,
	filter: (sourceData) => !!sourceData.selectedDeviceId,
	fn: (src, clk) => {
		const params: FetchDiagnosticChartParams = {
			deviceId: src.selectedDeviceId,
			fromDate: format(clk[0], 'yyyy-MM-dd HH:mm:ss'),
			toDate: format(clk[1], 'yyyy-MM-dd HH:mm:ss'),
		};
		return params;
	},
	target: fetchDiagnosticChartFx,
});

// Add shape to the shapes collection with device id as key
sample({
	clock: fetchDiagnosticChartFx.done,
	fn: (clk) =>
		({
			id: Number(clk.params.deviceId),
			shape: clk.result,
		} as AddShapeFnParams),
	target: addShapes,
});
