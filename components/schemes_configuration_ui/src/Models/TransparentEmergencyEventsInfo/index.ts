import { createStore, sample } from 'effector';

import {
	getFilterOptionsByEventStatusType,
	getFilterOptionsByKvitPersons,
} from '../../Containers/TransparentEmergencyEventsTable/utils';
import { SortOrder } from '../../Shared/types';

import { fetchTransparentEmergencyEventsStatus } from './effects';
import {
	setEventsInfo,
	setEventStatusTypeOptions,
	setKvitPersonsOptions,
	setMetricId,
	setSelectedEventStatusTypeOptions,
	setSelectedKvitPersonsOptions,
	setTableSortFilter,
} from './events';
import { TransparentEmergencyEventsInfo } from './types';

export const $transparentEmergencyEventsInfo =
	createStore<TransparentEmergencyEventsInfo>({
		metricId: null,
		eventsInfo: [],
		isGroupChartModalOpen: false,
		eventStatusType: [],
		kvitPersons: [],
		selectedEventStatusType: [],
		selectedKvitPersons: [],
		sortFilter: { accessor: '', order: SortOrder.None },
	});

$transparentEmergencyEventsInfo.on(setMetricId, (state, metricId) => {
	return {
		...state,
		metricId,
	};
});
$transparentEmergencyEventsInfo.on(setEventsInfo, (state, eventsInfo) => {
	return {
		...state,
		eventsInfo,
	};
});
$transparentEmergencyEventsInfo.on(
	setEventStatusTypeOptions,
	(state, options) => {
		return {
			...state,
			eventStatusType: options,
		};
	},
);
$transparentEmergencyEventsInfo.on(setKvitPersonsOptions, (state, options) => {
	return {
		...state,
		kvitPersons: options,
	};
});
$transparentEmergencyEventsInfo.on(
	setSelectedEventStatusTypeOptions,
	(state, options) => {
		return {
			...state,
			selectedEventStatusType: options,
		};
	},
);
$transparentEmergencyEventsInfo.on(
	setSelectedKvitPersonsOptions,
	(state, options) => {
		return {
			...state,
			selectedKvitPersons: options,
		};
	},
);

$transparentEmergencyEventsInfo.on(setTableSortFilter, (state, sortFilter) => {
	return {
		...state,
		sortFilter,
	};
});
sample({
	clock: fetchTransparentEmergencyEventsStatus.doneData,
	target: setEventsInfo,
});
sample({
	clock: setEventsInfo,
	source: $transparentEmergencyEventsInfo,
	fn: (_sourceData, clockData) => {
		return getFilterOptionsByEventStatusType(clockData);
	},
	target: setEventStatusTypeOptions,
});
sample({
	clock: setEventsInfo,
	source: $transparentEmergencyEventsInfo,
	fn: (_sourceData, clockData) => {
		return getFilterOptionsByKvitPersons(clockData);
	},
	target: setKvitPersonsOptions,
});

sample({
	clock: setEventsInfo,
	source: $transparentEmergencyEventsInfo,
	fn: (_sourceData, clockData) => {
		const options = getFilterOptionsByEventStatusType(clockData);
		return options
			.filter((item) => item.isChecked)
			.map((item) => Number(item.key));
	},
	target: setSelectedEventStatusTypeOptions,
});
sample({
	clock: setEventsInfo,
	source: $transparentEmergencyEventsInfo,
	fn: (_sourceData, clockData) => {
		const options = getFilterOptionsByKvitPersons(clockData);
		return [
			...options.filter((item) => item.isChecked).map((item) => item.key),
			'Не квитировано',
		];
	},
	target: setSelectedKvitPersonsOptions,
});
