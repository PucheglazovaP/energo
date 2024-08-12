import { createStore } from 'effector';

import { fetchPicturesDynamicObjectFx } from './effects';
import { setPicturesDynamic, setPicturesDynamicObject } from './event';

export const $informationPictures = createStore<any>([]);

$informationPictures.on(setPicturesDynamicObject, (state, tree) => {
	if (JSON.stringify(state) === JSON.stringify(tree)) return state;

	return tree;
});

setPicturesDynamic.watch(({ codeForm, codeObject, nameParameter }) => {
	fetchPicturesDynamicObjectFx({ codeForm, codeObject, nameParameter });
});
