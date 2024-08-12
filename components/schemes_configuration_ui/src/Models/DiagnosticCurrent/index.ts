import { createStore, sample } from 'effector';

import {
	fetchDiagnosticCurrentStateSampleAdapter,
	updateDeviceFavoriteStateAdapter,
} from '../../Adapters/diagnosticAdapters';
import { handleError } from '../../Utils/handleToast';
import { $activeIds } from '../ActiveIds';
import { $user } from '../Auth';

import { DEFAULT_MODEL } from './constants';
import {
	fetchDiagnosticCurrentStateEffect,
	updateDeviceFavoriteStateEffect,
} from './effects';
import {
	fetchDiagnosticCurrentStateEffectHandler,
	getCurrentDiagnosticDevicesDataEvent,
	selectAllBooleanStorageEvent,
	selectAllBooleanStorageEventHandler,
	setDiagnosticPaginationPageEvent,
	setDiagnosticPaginationPageEventHandler,
	setFilterExpressionEvent,
	setFilterExpressionEventHandler,
	setSelectedDeviceIdEvent,
	setSelectedDeviceIdEventHandler,
	setSelectedServerIdEvent,
	setSelectedServerIdEventHandler,
	setSelectedSwitcherItemEvent,
	setSelectedSwitcherItemEventHandler,
	toggleBooleanStorageEvent,
	toggleBooleanStorageEventHandler,
} from './events';
import {
	DiagnosticCurrentModel,
	StorageFieldName,
	ToggleBooleanStorageEvent,
} from './types';

const $diagnosticCurrentModel =
	createStore<DiagnosticCurrentModel>(DEFAULT_MODEL);

// Events
$diagnosticCurrentModel.on(
	toggleBooleanStorageEvent,
	toggleBooleanStorageEventHandler,
);

$diagnosticCurrentModel.on(
	setDiagnosticPaginationPageEvent,
	setDiagnosticPaginationPageEventHandler,
);

$diagnosticCurrentModel.on(
	selectAllBooleanStorageEvent,
	selectAllBooleanStorageEventHandler,
);

$diagnosticCurrentModel.on(
	setFilterExpressionEvent,
	setFilterExpressionEventHandler,
);

$diagnosticCurrentModel.on(
	setSelectedSwitcherItemEvent,
	setSelectedSwitcherItemEventHandler,
);

$diagnosticCurrentModel.on(
	setSelectedServerIdEvent,
	setSelectedServerIdEventHandler,
);

$diagnosticCurrentModel.on(
	setSelectedDeviceIdEvent,
	setSelectedDeviceIdEventHandler,
);

// Effects
$diagnosticCurrentModel.on(
	fetchDiagnosticCurrentStateEffect.doneData,
	fetchDiagnosticCurrentStateEffectHandler,
);

fetchDiagnosticCurrentStateEffect.fail.watch(({ error }) => {
	handleError(error);
});

updateDeviceFavoriteStateEffect.fail.watch(({ error }) => {
	handleError(error);
});

// Load current devices data depends on filters
sample({
	clock: [
		getCurrentDiagnosticDevicesDataEvent,
		setSelectedServerIdEvent,
		setSelectedSwitcherItemEvent,
	],
	source: [$diagnosticCurrentModel, $activeIds, $user],
	fn: fetchDiagnosticCurrentStateSampleAdapter,
	target: fetchDiagnosticCurrentStateEffect,
});

// Update device favorite state
sample({
	clock: toggleBooleanStorageEvent,
	source: [$diagnosticCurrentModel, $user],
	filter: (_state, data: ToggleBooleanStorageEvent) =>
		data.storageFieldName === StorageFieldName.DevicesFavoriteStorage,
	fn: updateDeviceFavoriteStateAdapter,
	target: updateDeviceFavoriteStateEffect,
});

export default $diagnosticCurrentModel;
