import { createStore } from 'effector';

import {
	setImagesCollectionIsLoading,
	setImagesCollectionList,
} from './events';
import { ImagesCollectionModel } from './types';

const initialState: ImagesCollectionModel = {
	list: [],
	isLoading: false,
};

export const $imagesCollection =
	createStore<ImagesCollectionModel>(initialState);

$imagesCollection.on(setImagesCollectionIsLoading, (state, isLoading) => {
	return {
		...state,
		isLoading,
	};
});

$imagesCollection.on(setImagesCollectionList, (state, list) => {
	return {
		...state,
		list,
	};
});
