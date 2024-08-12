import { createStore } from 'effector';

import { setInformationAboutBanners } from './event';

export const $information = createStore<any>([]);

$information.on(setInformationAboutBanners, (state, info) => {
	if (JSON.stringify(state) === JSON.stringify(info)) return state;

	return info;
});
