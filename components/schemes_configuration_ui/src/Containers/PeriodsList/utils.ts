import endOfMonth from 'date-fns/endOfMonth';
import endOfYear from 'date-fns/endOfYear';
import startOfMonth from 'date-fns/startOfMonth';
import startOfYear from 'date-fns/startOfYear';

import { CalendarType } from '../../Shared/types';

export function getDatePeriodByCalendarType(
	type: CalendarType,
	period: {
		startDateTime: Date;
		endDateTime: Date;
	},
) {
	let startDateTime = new Date();
	let endDateTime = new Date();
	switch (type) {
		case CalendarType.Day: {
			startDateTime = period.startDateTime;
			endDateTime = period.startDateTime;
			break;
		}
		case CalendarType.Month: {
			startDateTime = startOfMonth(period.startDateTime);
			endDateTime = endOfMonth(period.endDateTime);
			break;
		}
		case CalendarType.Year: {
			startDateTime = startOfYear(period.startDateTime);
			endDateTime = endOfYear(period.endDateTime);
			break;
		}
	}
	return { startDateTime, endDateTime };
}
