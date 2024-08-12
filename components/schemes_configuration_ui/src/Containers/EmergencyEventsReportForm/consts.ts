import {
	EmergencyEventsReportTypes,
	SwitcherItemType,
} from '../../Shared/types';

export const KVIT_STATUS_LIST = [
	{
		value: 0,
		label: 'Все статусы квитирования',
		isSelected: true,
	},
	{
		value: 1,
		label: 'Сквитированные',
		isSelected: false,
	},
	{
		value: 2,
		label: 'Несквитированные',
		isSelected: false,
	},
	{
		value: 3,
		label: 'Сквитированные позже конца события',
		isSelected: false,
	},
	{
		value: 4,
		label: 'Завершенные несквитированные',
		isSelected: false,
	},
];
export const EVENT_STATUS_LIST = [
	{
		value: 0,
		label: 'Все статусы события',
		isSelected: true,
	},
	{
		value: 1,
		label: 'Неустранненые',
		isSelected: false,
	},
	{
		value: 2,
		label: 'Устраняемые',
		isSelected: false,
	},
	{
		value: 3,
		label: 'Устранненые',
		isSelected: false,
	},
];
export const EVENT_TYPE_LIST = [
	{
		value: 0,
		label: 'Все типы события',
		isSelected: true,
	},
	{
		value: 2,
		label: 'Ниже уставки',
		isSelected: false,
	},
	{
		value: 3,
		label: 'Выше уставки',
		isSelected: false,
	},
	{
		value: 5,
		label: 'Ниже или выше уставки',
		isSelected: false,
	},
	{
		value: 4,
		label: 'Неккоректные данные',
		isSelected: false,
	},
];

export const REPORT_TYPES_LIST: SwitcherItemType[] = [
	{
		id: EmergencyEventsReportTypes.Events,
		title: 'События',
	},
	{
		id: EmergencyEventsReportTypes.Criterions,
		title: 'Критерии',
	},
];

export const DATE_FORMAT = 'dd.MM.yyyy';
