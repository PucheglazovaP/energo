import { Cell } from '../../Components/Table/types';

export const ELEMENT_HISTORY_HEADER: Cell[] = [
	{
		name: 'collapse',
		value: '',
	},
	{
		name: 'status',
		value: 'Вид изменения',
	},
	{
		name: 'fullDate',
		value: 'Дата и время изменения',
	},
	{
		name: 'user',
		value: 'Пользователь',
	},
	{
		name: 'number',
		value: 'Номер объекта',
	},
	{
		name: 'subsystem',
		value: 'Подсистема',
	},
];

export const GENERAL_HISTORY_HEADER: Cell[] = [
	{
		name: 'collapse',
		value: '',
	},
	{
		name: 'status',
		value: 'Вид изменения',
	},
	{
		name: 'fullDate',
		value: 'Дата и время изменения',
	},
	{
		name: 'user',
		value: 'Пользователь',
	},
	{
		name: 'type',
		value: 'Тип объекта',
	},
	{
		name: 'number',
		value: 'Номер объекта',
	},
	{
		name: 'subsystem',
		value: 'Подсистема',
	},
];

export const HISTORY_OBJECT_HEADER: Cell[] = [
	{
		name: 'parameter',
		value: 'Параметр',
	},
	{
		name: 'previous',
		value: 'Предыдущее значение',
	},
	{
		name: 'current',
		value: 'Новое значение',
	},
];
