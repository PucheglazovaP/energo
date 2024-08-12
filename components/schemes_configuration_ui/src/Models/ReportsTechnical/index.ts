import { format, startOfDay, startOfMonth, subDays, subMonths } from 'date-fns';
import { createStore } from 'effector';

import { setDatePeriod } from './events';
import { DatePeriod } from './types';

export const $datePeriod = createStore<DatePeriod>({
	startDate: new Date(
		`${format(
			startOfDay(new Date()) === startOfMonth(new Date())
				? subMonths(startOfMonth(new Date()), 1)
				: startOfMonth(new Date()),
			'yyyy.MM.dd',
		)} 00:00:00`,
	),
	endDate: new Date(
		`${format(
			startOfDay(new Date()) === startOfMonth(new Date())
				? new Date()
				: subDays(new Date(), 1),
			'yyyy.MM.dd',
		)} 00:00:00`,
	),
});

$datePeriod.on(setDatePeriod, (_state, payload) => payload);
