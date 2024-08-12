import { createEvent } from 'effector';

import { FetchDiagnosticCurrentStateEffectAdapterReturn } from '../../Adapters/diagnosticAdapters';

import {
	DiagnosticCurrentModel,
	DiagnosticDevice,
	FilterExpressionEvent,
	SelectAllBooleanStorageEvent,
	ServersFavoritesSwitcher,
	ToggleBooleanStorageEvent,
} from './types';

export const toggleBooleanStorageEvent =
	createEvent<ToggleBooleanStorageEvent>();
export function toggleBooleanStorageEventHandler(
	state: DiagnosticCurrentModel,
	data: ToggleBooleanStorageEvent,
): DiagnosticCurrentModel {
	const { storageFieldName, dictionaryKey, initialValue } = data;
	const storage = state[storageFieldName];
	const nextStatus =
		storage[dictionaryKey] === undefined
			? !initialValue
			: !storage[dictionaryKey];

	return {
		...state,
		[storageFieldName]: {
			...storage,
			[dictionaryKey]: nextStatus,
		},
	};
}

export const selectAllBooleanStorageEvent =
	createEvent<SelectAllBooleanStorageEvent>();
export function selectAllBooleanStorageEventHandler(
	state: DiagnosticCurrentModel,
	data: SelectAllBooleanStorageEvent,
): DiagnosticCurrentModel {
	const { storageFieldName, dictionaryKeys, initialValue } = data;
	const newStorage = { ...state[storageFieldName] };

	const isChecked = Object.values(newStorage).some((value) => value);
	if (isChecked) {
		Object.entries(newStorage).forEach(([key]) => (newStorage[key] = false));
	} else {
		dictionaryKeys.map((key) => {
			const nextStatus =
				newStorage[key] === undefined ? !initialValue : !newStorage[key];

			newStorage[key] = nextStatus;
		});
	}

	return {
		...state,
		[storageFieldName]: newStorage,
	};
}

export const setDiagnosticDevices = createEvent<DiagnosticDevice[]>();
export function setDiagnosticDevicesHandler(
	state: DiagnosticCurrentModel,
	devices: DiagnosticDevice[],
): DiagnosticCurrentModel {
	return { ...state, devices };
}

export function fetchDiagnosticCurrentStateEffectHandler(
	state: DiagnosticCurrentModel,
	data: FetchDiagnosticCurrentStateEffectAdapterReturn,
): DiagnosticCurrentModel {
	const { devices } = data;
	const devicesFavoriteStorage = devices.reduce(
		(accumulator: Record<string, boolean>, item) => {
			if (item.isFavorite) {
				accumulator[item.number] = true;
			}

			return accumulator;
		},
		{},
	);

	return { ...state, ...data, devicesFavoriteStorage };
}

export const setDiagnosticPaginationPageEvent = createEvent<number>();
export function setDiagnosticPaginationPageEventHandler(
	state: DiagnosticCurrentModel,
	paginationPage: number,
): DiagnosticCurrentModel {
	return { ...state, currentPage: paginationPage };
}

export const getCurrentDiagnosticDevicesDataEvent = createEvent();

export const setFilterExpressionEvent = createEvent<FilterExpressionEvent>();
export function setFilterExpressionEventHandler(
	state: DiagnosticCurrentModel,
	data: FilterExpressionEvent,
): DiagnosticCurrentModel {
	const { expressionFieldName, expressionValue } = data;

	return { ...state, [expressionFieldName]: expressionValue };
}

export const setSelectedSwitcherItemEvent =
	createEvent<ServersFavoritesSwitcher>();
export function setSelectedSwitcherItemEventHandler(
	state: DiagnosticCurrentModel,
	selectedSwitcherItem: ServersFavoritesSwitcher,
): DiagnosticCurrentModel {
	return { ...state, selectedSwitcherItem };
}

export const setSelectedServerIdEvent = createEvent<string>();
export function setSelectedServerIdEventHandler(
	state: DiagnosticCurrentModel,
	selectedServerId: string,
): DiagnosticCurrentModel {
	return { ...state, selectedServerId };
}

export const setSelectedDeviceIdEvent = createEvent<string>();
export function setSelectedDeviceIdEventHandler(
	state: DiagnosticCurrentModel,
	selectedDeviceId: string,
): DiagnosticCurrentModel {
	return { ...state, selectedDeviceId };
}

export default {};
