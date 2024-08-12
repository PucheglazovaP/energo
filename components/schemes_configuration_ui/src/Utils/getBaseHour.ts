export function getBaseHour(hour: number): string {
	return `${hour < 10 ? `0${hour}` : hour}:00`;
}
