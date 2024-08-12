import { createStore, sample } from 'effector';

import { fetchDiagnosticGroupCurrentStateFx } from './effects';
import { collapseDevices, setDevices, toggleExpandDevice } from './events';
import { DeviceHealthinessModel } from './types';

const initModel: DeviceHealthinessModel = {
	devices: [],
	expandedDevices: new Map(),
};

export const $deviceHealthiness =
	createStore<DeviceHealthinessModel>(initModel);

$deviceHealthiness.on(setDevices, (state, devices) => ({ ...state, devices }));

$deviceHealthiness.on(toggleExpandDevice, (state, accessor) => {
	const newExpanded = new Map(state.expandedDevices);
	if (!newExpanded.has(accessor)) {
		newExpanded.set(accessor, true);
	} else {
		const expandedDevice = newExpanded.get(accessor);
		newExpanded.set(accessor, !expandedDevice);
	}
	return {
		...state,
		expandedDevices: newExpanded,
	};
});

$deviceHealthiness.on(collapseDevices, (state) => {
	const emptyExpanded: Map<number, boolean> = new Map();
	return {
		...state,
		expandedDevices: emptyExpanded,
	};
});

/* DECLARATIVES */
sample({
	clock: fetchDiagnosticGroupCurrentStateFx.doneData,
	target: setDevices,
});
