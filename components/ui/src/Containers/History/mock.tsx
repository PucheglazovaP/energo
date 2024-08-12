import { Arrow } from '../../Components/Icons';
import IconButton from '../../Components/Icons/IconButton';
import { ArrowDirection } from '../../Components/Icons/types';
import { Cell, Row } from '../../Components/Table/types';

import styles from './History.module.scss';

export const MOCK_HEADER = [
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
] as Cell[];

export const MOCK_ROWS = [
	{
		id: '1',
		className: styles.row,
		cells: [
			{
				name: 'collapse',
				renderFn: () => (
					<IconButton onClick={() => console.log('icon clicked')}>
						<Arrow direction={ArrowDirection.DOWN} />
					</IconButton>
				),
				className: styles.table__cell,
			},
			{
				name: 'status',
				value: 'Создано',
			},
			{
				name: 'fullDate',
				value: '00.00.0000 00:00',
			},
			{
				name: 'user',
				value: 'Фамилия Имя Отчество',
			},
			{
				name: 'type',
				value: 'Наименование',
			},
			{
				name: 'number',
				value: 'Наименование',
			},
			{
				name: 'subsystem',
				value: 'Наименование подсистемы',
			},
		],
	},
	{
		id: '2',
		className: styles.row,
		cells: [
			{
				name: 'collapse',
				className: styles.table__cell,
				renderFn: () => (
					<IconButton onClick={() => console.log('icon clicked')}>
						<Arrow direction={ArrowDirection.DOWN} />
					</IconButton>
				),
			},
			{
				name: 'status',
				value: 'Создано',
			},
			{
				name: 'fullDate',
				value: '00.00.0000 00:00',
			},
			{
				name: 'user',
				value: 'Фамилия Имя Отчество',
			},
			{
				name: 'type',
				value: 'Наименование',
			},
			{
				name: 'number',
				value: 'Наименование',
			},
			{
				name: 'subsystem',
				value: 'Наименование подсистемы',
			},
		],
	},
	{
		id: '3',
		className: styles.row,
		cells: [
			{
				name: 'collapse',
				className: styles.table__cell,
				renderFn: () => (
					<IconButton onClick={() => console.log('icon clicked')}>
						<Arrow direction={ArrowDirection.RIGHT} />
					</IconButton>
				),
			},
			{
				name: 'status',
				value: 'Создано',
			},
			{
				name: 'fullDate',
				value: '00.00.0000 00:00',
			},
			{
				name: 'user',
				value: 'Фамилия Имя Отчество',
			},
			{
				name: 'type',
				value: 'Наименование',
			},
			{
				name: 'number',
				value: 'Наименование',
			},
			{
				name: 'subsystem',
				value: 'Наименование подсистемы',
			},
		],
	},
	{
		id: '4',
		className: styles.row,
		cells: [
			{
				name: 'collapse',
				className: styles.table__cell,
				renderFn: () => (
					<IconButton onClick={() => console.log('icon clicked')}>
						<Arrow direction={ArrowDirection.DOWN} />
					</IconButton>
				),
			},
			{
				name: 'status',
				value: 'Создано',
			},
			{
				name: 'fullDate',
				value: '00.00.0000 00:00',
			},
			{
				name: 'user',
				value: 'Фамилия Имя Отчество',
			},
			{
				name: 'type',
				value: 'Наименование',
			},
			{
				name: 'number',
				value: 'Наименование',
			},
			{
				name: 'subsystem',
				value: 'Наименование подсистемы',
			},
		],
		child: {
			header: [
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
			],
			rows: [
				{
					id: '1',
					cells: [
						{
							name: 'parameter',
							value: 'Наименование',
						},
						{
							name: 'previous',
							value: '000 000',
						},
						{
							name: 'current',
							value: '000 000',
						},
					],
				},
			],
		},
	},
	{
		id: '5',
		className: styles.row,
		cells: [
			{
				name: 'collapse',
				className: styles.table__cell,
				renderFn: () => (
					<IconButton onClick={() => console.log('icon clicked')}>
						<Arrow direction={ArrowDirection.RIGHT} />
					</IconButton>
				),
			},
			{
				name: 'status',
				value: 'Создано',
			},
			{
				name: 'fullDate',
				value: '00.00.0000 00:00',
			},
			{
				name: 'user',
				value: 'Фамилия Имя Отчество',
			},
			{
				name: 'type',
				value: 'Наименование',
			},
			{
				name: 'number',
				value: 'Наименование',
			},
			{
				name: 'subsystem',
				value: 'Наименование подсистемы',
			},
		],
	},
] as Row[];
