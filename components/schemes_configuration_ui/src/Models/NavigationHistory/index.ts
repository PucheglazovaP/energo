import { createStore } from 'effector';

import { saveNavigationHistory } from '../FormTabs/events';

import {
	changeChannelRoute,
	changeDeviceRoute,
	changeFormRoute,
	deleteChannelLastRoute,
	deleteDeviceLastRoute,
	deleteFormLastRoute,
	resetNavigationHistory,
	setChannelNavigationHistory,
	setDeviceNavigationHistory,
	setFormNavigationHistory,
} from './events';
import { NavigationHistory } from './types';

// Cтор для хранения истории навигации

export const $navigationHistory = createStore<NavigationHistory>({
	form: [],
	devices: [],
	channels: [],
});

$navigationHistory.on(changeFormRoute, (state, route) => {
	if (state.form.at(-1) !== route)
		return {
			...state,
			form: [...state.form, route],
		};
});
$navigationHistory.on(deleteFormLastRoute, (state) => {
	return {
		...state,
		form: state.form.slice(0, -1),
	};
});

$navigationHistory.on(setFormNavigationHistory, (state, history) => {
	return {
		...state,
		form: [...history],
	};
});
$navigationHistory.on(changeDeviceRoute, (state, route) => {
	if (state.devices.at(-1) !== route)
		return {
			...state,
			devices: [...state.devices, route],
		};
});
$navigationHistory.on(deleteDeviceLastRoute, (state) => {
	return {
		...state,
		devices: state.devices.slice(0, -1),
	};
});

$navigationHistory.on(setDeviceNavigationHistory, (state, history) => {
	return {
		...state,
		devices: [...history],
	};
});
$navigationHistory.on(changeChannelRoute, (state, route) => {
	if (state.channels.at(-1) !== route)
		return {
			...state,
			channels: [...state.channels, route],
		};
});
$navigationHistory.on(deleteChannelLastRoute, (state) => {
	return {
		...state,
		channels: state.channels.slice(0, -1),
	};
});

$navigationHistory.on(setChannelNavigationHistory, (state, history) => {
	return {
		...state,
		channels: [...history],
	};
});

$navigationHistory.reset(resetNavigationHistory);

$navigationHistory.watch((navigationHistory) => {
	saveNavigationHistory(navigationHistory);
});
