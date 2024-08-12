import { EmergencyEventType } from '../../Shared/types';

export const statusesLabels = new Map<
	EmergencyEventType,
	{ label: string; color: string }
>([
	[
		EmergencyEventType.NoDataSource,
		{ label: 'Нет источника данных', color: '#e5e5e5' },
	],
	[EmergencyEventType.Good, { label: 'Норма', color: '#92bc8c' }],
	[EmergencyEventType.OutOfMin, { label: 'Ниже', color: '#C7A6CD' }],
	[EmergencyEventType.OutOfMax, { label: 'Выше', color: '#EB5835' }],
	[EmergencyEventType.Failure, { label: 'Сбой', color: '#F9A823' }],
	[
		EmergencyEventType.OutOfMinOrMax,
		{ label: 'Ниже или выше нормы', color: '#9c4707' },
	],
	[EmergencyEventType.Accident, { label: 'Авария', color: '#e32213' }],
]);
