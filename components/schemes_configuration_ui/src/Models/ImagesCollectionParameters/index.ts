import { createStore } from 'effector';

import {
	resetCheckedImages,
	setFormParameters,
	setPreviewImage,
	setType,
	switchImage,
	toggleImage,
} from './events';
import { CollectionType, ImagesCollectionParametersModel } from './types';

const initialState: ImagesCollectionParametersModel = {
	type: CollectionType.multiple,
	checkedImagesIds: [],
	previewImageId: 0,
	previewImage: '',
	formParameters: null,
};

export const $imagesCollectionParameters =
	createStore<ImagesCollectionParametersModel>(initialState);

$imagesCollectionParameters.on(setType, (state, type) => ({
	...state,
	type,
}));

$imagesCollectionParameters.on(toggleImage, (state, id) => {
	const { checkedImagesIds } = state;
	const newCheckedImagesIds: number[] = [];
	if (checkedImagesIds.includes(id)) {
		newCheckedImagesIds.push(
			...checkedImagesIds.filter((checkedId) => checkedId !== id),
		);
	} else {
		newCheckedImagesIds.push(...checkedImagesIds, id);
	}
	return {
		...state,
		checkedImagesIds: newCheckedImagesIds,
	};
});

$imagesCollectionParameters.on(switchImage, (state, id) => {
	return {
		...state,
		checkedImagesIds: [id],
	};
});

$imagesCollectionParameters.on(setPreviewImage, (state, bin) => {
	return {
		...state,
		previewImage: bin,
	};
});

$imagesCollectionParameters.on(resetCheckedImages, (state) => {
	return {
		...state,
		checkedImagesIds: [],
	};
});

$imagesCollectionParameters.on(setFormParameters, (state, formParameters) => {
	return {
		...state,
		formParameters,
	};
});
