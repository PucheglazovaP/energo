export function isDate(value: string): boolean {
	return /^[0-9]{4}-[0-9]{2}-[0-9]{2}(\s|_)[0-9]{2}:[0-9]{2}:[0-9]{2}$/.test(
		value,
	);
}
