import { MAX_DATE } from './const';

export function checkIsMaxDate(date: Date): boolean {
	return (
		date.getFullYear() === MAX_DATE.getFullYear() &&
		date.getMonth() === MAX_DATE.getMonth() &&
		date.getDate() === MAX_DATE.getDate()
	);
}
