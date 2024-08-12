import { CalendarType } from '../../Shared/types';

export type PeriodWithColor = {
	startDateTime: Date;
	endDateTime: Date;
	color: string;
};
export type PeriodList = {
	startDateTime: Date;
	endDateTime: Date;
	color: string;
	id: string;
	type: CalendarType;
};
export type Period = {
	startDateTime: Date;
	endDateTime: Date;
	id: string;
};
