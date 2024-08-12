import { TabName } from './types';

export const nsiTabOptions: Array<{
	value: string;
	label: string;
}> = [
	{
		value: TabName.USER_SETTINGS,
		label: 'Пользовательские параметры',
	},
	{
		value: TabName.MEASURING_INSTRUMENTS_JOURNAL,
		label: 'Журнал средств измерений',
	},
	{
		value: TabName.DETAILED_INFORMATION,
		label: 'Подробная информация',
	},
	{
		value: TabName.CONFIGURATION_HISTORY,
		label: 'История конфигурирования',
	},
];
