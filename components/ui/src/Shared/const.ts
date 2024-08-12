//TODO remove auth skip in local
export const NEED_TO_SKIP_AUTH = window.location.origin.includes(
	import.meta.env.VITE_LOCAL_POINT,
);
export const LOCAL_USER = {
	id: '52cac67e-0250-4417-a0bb-1b18313e8b15',
	lastName: 'Akhtyamov',
	firstName: 'Maksim',
	secondName: '',
	email: 'maksim.akhtyamov@evraz.com',
	preferredUsername: 'akhtyamov_mo',
	roles: [],
};

export const startDateItems = ['start_shift', 'start_day', 'start_month'];
export const beforeDateItems = ['minute', 'half', 'hour', 'day', 'month'];
export const datePartItems = [
	'year',
	'quarter',
	'month',
	'_day_of_year',
	'day',
	'week',
	'_week_day',
	'hour',
	'minute',
	'second',
];
