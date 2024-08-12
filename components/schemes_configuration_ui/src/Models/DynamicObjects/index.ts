import { createStore } from 'effector';

import { setDynamicObjects } from './event';

export const $informationDynamic = createStore([]);

$informationDynamic.on(setDynamicObjects, (state, tree) => {
	if (JSON.stringify(state) === JSON.stringify(tree)) return state;

	return tree;
});
