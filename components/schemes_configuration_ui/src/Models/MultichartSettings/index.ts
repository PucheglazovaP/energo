import { createStore } from 'effector';

import { setMultichartActiveId, setMultichartSeries } from './events';
import { MultichartSettingsModel } from './types';

const init: MultichartSettingsModel = {
	activeId: 0, // id of chosen entity (trend or form)
	series: [],
};

export const $multichartSettings = createStore(init);

$multichartSettings.on(setMultichartActiveId, (state, activeId) => {
	return {
		...state,
		activeId,
	};
});

$multichartSettings.on(setMultichartSeries, (state, series) => ({
	...state,
	series,
}));
