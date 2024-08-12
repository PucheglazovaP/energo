import { createEvent } from 'effector';

export const setDatePeriod = createEvent<{
	startDate: Date;
	endDate: Date;
}>();
