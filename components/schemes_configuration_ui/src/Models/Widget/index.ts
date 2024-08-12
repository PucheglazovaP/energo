import { addDays, format, subDays } from 'date-fns';
import { createStore } from 'effector';

import { resetWidget, setWidgetData, setWidgetOpen } from './events';
import { Widget } from './types';

export const $widget = createStore<Widget>({
	versionCode: 90,
	formId: undefined,
	title: '',
	isMoscowTimeZone: false,
	startDateTime: new Date(
		`${format(subDays(new Date(), 1), 'yyyy.MM.dd')} 00:00:00`,
	),
	endDateTime: new Date(
		`${format(addDays(new Date(), 1), 'yyyy.MM.dd')} 00:00:00`,
	),
	isUpdateEnabled: false,
	updateDelay: 60,
	unitList: [],
	discreteList: [],
	isTimeWithoutDataEnabled: false,
	isRelativeZeroEnabled: false,
	isArchiveModeEnabled: false,
	isMultiYaxesEnabled: false,
	chartData: [],
	tableHeader: [
		{
			accessor: 'date',
			text: 'Дата и время',
			isResizable: false,
			isSortable: false,
			sortOrder: 0,
			type: 'string',
			minWidth: 100,
		},
	],
	isWidgetOpen: false,
});
$widget.on(setWidgetOpen, (state, isWidgetOpen) => {
	return {
		...state,
		isWidgetOpen,
	};
});
$widget.on(setWidgetData, (state, settings) => {
	return {
		...state,
		...settings,
		...settings.formSettings,
		title: settings.title || '',
	};
});
$widget.reset(resetWidget);
