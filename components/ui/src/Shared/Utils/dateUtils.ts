import { format } from 'date-fns';

type DateAvailableType = string | Date | number;

export enum DateFormat {
	DefaultDisplayFormat = 'dd.MM.yyyy_HH:mm',
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

export function formatDate(
	date: DateAvailableType,
	dateFormat: DateFormat,
): string {
	return exceptionHandler(date, () => format(new Date(date), dateFormat));
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
export default {};
