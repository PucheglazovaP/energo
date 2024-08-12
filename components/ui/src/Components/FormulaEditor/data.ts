import { DataTabsElem, DateArgumentItem, DateArgumentList } from './types';

export const argumentItems: DateArgumentList[] = [
	{
		type: DateArgumentItem.Input,
		value: '',
		placeholder: DataTabsElem.Group,
		needRenderAddButton: true,
	},
	{
		type: DateArgumentItem.Input,
		value: '',
		placeholder: DataTabsElem.Start,
		needRenderAddButton: true,
		dropdown: true,
		options: [
			{ Name: 'Начало смены', ID: 0 },
			{ Name: 'Начало суток', ID: 1 },
			{ Name: 'Начало месяца', ID: 2 },
		],
	},
	{
		type: DateArgumentItem.Input,
		value: '',
		placeholder: DataTabsElem.Channel,
		needRenderAddButton: true,
	},
	{
		type: DateArgumentItem.Input,
		value: '',
		placeholder: DataTabsElem.Before,
		needRenderAddButton: true,
		dropdown: true,
		options: [
			{ Name: 'Минута', ID: 0 },
			{ Name: '30 минут', ID: 1 },
			{ Name: 'Час', ID: 2 },
			{ Name: 'Сутки', ID: 3 },
			{ Name: 'Месяц', ID: 4 },
		],
	},
];

export const dateItems: DateArgumentList[] = [
	{
		type: DateArgumentItem.Calendar,
		value: '',
		placeholder: DataTabsElem.CalendarDate,
	},
	{
		type: DateArgumentItem.Input,
		value: '',
		placeholder: DataTabsElem.DatePart,
		needRenderAddButton: true,
		dropdown: true,
		options: [
			{ Name: 'Год', ID: 0 },
			{ Name: 'Квартал', ID: 1 },
			{ Name: 'Месяц', ID: 2 },
			{ Name: 'День в году', ID: 3 },
			{ Name: 'Сутки', ID: 4 },
			{ Name: 'Неделя', ID: 5 },
			{ Name: 'День недели', ID: 6 },
			{ Name: 'Час', ID: 7 },
			{ Name: 'Минута', ID: 8 },
			{ Name: 'Секунда', ID: 9 },
		],
	},
	{
		type: DateArgumentItem.Button,
		value: '',
		placeholder: DataTabsElem.DaysOfMonth,
		needRenderAddButton: true,
	},
	{
		type: DateArgumentItem.Button,
		value: '',
		placeholder: DataTabsElem.CurrentDate,
		needRenderAddButton: true,
	},
];
