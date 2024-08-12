import { createStore } from 'effector';
import { v4 as uuidv4 } from 'uuid';

import { YAXIS_LINE_COLORS } from '../../Shared/const';
import { CalendarType } from '../../Shared/types';
import { generateRandomColor } from '../../Utils/generateRandomColor';

import {
	addPeriod,
	changePeriod,
	deletePeriod,
	resetPeriodList,
	setPeriods,
} from './events';
import { PeriodList } from './types';

// Cтор для хранения истории навигации

export const $periodsForChartComparison = createStore<PeriodList[]>([]);

$periodsForChartComparison.on(addPeriod, (periods, period) => {
	const uniqueId = uuidv4();
	const color =
		periods.length - 1 <= 10
			? YAXIS_LINE_COLORS[periods.length - 1]
			: generateRandomColor(['#EB5835', ...YAXIS_LINE_COLORS]);
	return [
		...periods,
		{ ...period, id: uniqueId, color, type: CalendarType.PeriodWithTime },
	];
});
$periodsForChartComparison.on(deletePeriod, (periods, id) => {
	periods.filter((item) => item.id !== id);
});

$periodsForChartComparison.on(setPeriods, (state, periods) => periods);

$periodsForChartComparison.reset(resetPeriodList);

$periodsForChartComparison.on(changePeriod, (periods, { period, id }) => {
	return periods.map((item) => {
		if (item.id === id)
			return { ...item, startDateTime: period[0], endDateTime: period[1] };
		return item;
	});
});
