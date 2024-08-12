import { format } from 'date-fns';
import { addDays, sub } from 'date-fns/esm';

import { AggregateTypes } from '../Shared/types';

type DateAvailableType = string | Date | number;

export enum DateFormat {
	DefaultDisplayFormat = 'dd.MM.yyyy, HH:mm',
	DefaultDisplayFormatWithSeconds = 'dd.MM.yyyy, HH:mm:ss',
	DisplayFormatWithoutTime = 'dd.MM.yyyy',
	DisplayDatabaseFormat = 'yyyy-MM-dd HH:mm:ss',
}

function exceptionHandler(date: DateAvailableType, action: () => string) {
	try {
		return action();
	} catch (_e) {
		return date?.toString() || '';
	}
}

// Format UTC date into local time string date
// Input 2022-12-21T10:00:00+00:00
// Output for MSK 21.12.2022, 13:00 (+3 hours)
export function formatToDefaultDisplayFormat(date: DateAvailableType): string {
	return exceptionHandler(date, () =>
		format(new Date(date), DateFormat.DefaultDisplayFormat),
	);
}

// Format UTC date into database string date
// Input 2022-12-21T10:00:00+00:00
// Output for MSK 21.12.2022T13:00 (+3 hours)
export function formatToDatabaseFormat(date: DateAvailableType): string {
	return exceptionHandler(date, () =>
		format(new Date(date), DateFormat.DisplayDatabaseFormat).replace(' ', 'T'),
	);
}

export function formatDate(
	date: DateAvailableType,
	dateFormat: DateFormat,
): string {
	return exceptionHandler(date, () => format(new Date(date), dateFormat));
}

/**
 * Get 2 dates with the start and the end of the day (00:00:00 and 23:59:59);
 * @returns [date, date] with start and end of the day
 */
export function getTodayDates(): [Date, Date] {
	const startOfTheDay: Date = new Date();
	startOfTheDay.setHours(0, 0, 0, 0);
	const endOfTheDay: Date = new Date();
	endOfTheDay.setHours(23, 59, 59, 999);
	return [startOfTheDay, endOfTheDay];
}

// Format string date from DB
export function formatStringDateToDefault(dateString: string): string {
	try {
		const [date, time] = dateString.split('_');
		const [year, month, day] = date.split('-');
		const [hour, min] = time.split(':');

		return `${day}.${month}.${year}_${hour}:${min}`;
	} catch (e) {
		return dateString;
	}
}
/**
 * Костыльная утилка для правильного расчета агрегатных величин
 *
 */
export function getDatesForAggregateValues({
	startDateTime,
	endDateTime,
	methodName,
}: {
	startDateTime: Date;
	endDateTime: Date;
	methodName: string;
}): [Date, Date] {
	const currentEndDateHours = endDateTime.getHours();
	const currentEndDateMinutes = endDateTime.getMinutes();
	const currentStartDateHours = startDateTime.getHours();
	const currentStartDateMinutes = startDateTime.getMinutes();
	const endDateTimeForRequest =
		currentEndDateHours === 23 && currentEndDateMinutes === 59
			? new Date(`${format(addDays(endDateTime, 1), 'yyyy.MM.dd')} 00:00:00`)
			: endDateTime;
	const startDateTimeForRequest =
		currentStartDateHours === 0 &&
		currentStartDateMinutes === 0 &&
		methodName === AggregateTypes.Current
			? new Date(
					`${format(sub(startDateTime, { days: 1 }), 'yyyy.MM.dd')} 23:59:59`,
			  )
			: startDateTime;
	return [startDateTimeForRequest, endDateTimeForRequest];
}
export function getDatesForChannelsAggregateValues({
	startDateTime,
	endDateTime,
	methodName,
}: {
	startDateTime: Date;
	endDateTime: Date;
	methodName: string;
}): [Date, Date] {
	const currentEndDateHours = endDateTime.getHours();
	const currentEndDateMinutes = endDateTime.getMinutes();
	const currentStartDateHours = startDateTime.getHours();
	const currentStartDateMinutes = startDateTime.getMinutes();
	const endDateTimeForRequest =
		currentEndDateHours === 23 && currentEndDateMinutes === 59
			? new Date(`${format(addDays(endDateTime, 1), 'yyyy.MM.dd')} 00:00:00`)
			: endDateTime;
	let startDateTimeForRequest = new Date();
	if (
		currentStartDateHours === 0 &&
		currentStartDateMinutes === 0 &&
		methodName !== AggregateTypes.Current
	)
		startDateTimeForRequest = new Date(
			`${format(startDateTime, 'yyyy.MM.dd')} 00:01:00`,
		);
	else startDateTimeForRequest = startDateTime;
	return [startDateTimeForRequest, endDateTimeForRequest];
}
export default {};
