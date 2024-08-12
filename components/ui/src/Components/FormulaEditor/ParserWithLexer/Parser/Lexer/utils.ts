export function isDate(value: string): boolean {
	return /^[0-9]{4}-[0-9]{2}-[0-9]{2}(\s|_)[0-9]{2}:[0-9]{2}:[0-9]{2}$/.test(
		value,
	);
}

export function hasNextReservedWord(text: string, start: number): boolean {
	return [
		'fun_1>',
		'fun_2>',
		'fun_3>',
		'fun_4>',
		'value_before>',
		'value_start>',
		'date_part>',
		'start_shift>',
		'start_day>',
		'start_month>',
		'minute>',
		'second>',
		'hour>',
		'half>',
		'_week_day>',
		'_day_of_year>',
		'week>',
		'day>',
		'year>',
		'quarter>',
		'month>',
	].some((resevedWord) => text.indexOf(resevedWord) === start);
}
