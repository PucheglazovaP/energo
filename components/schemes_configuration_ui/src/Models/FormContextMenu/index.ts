import { createStore } from 'effector';

import { DynamicObjectConfiguration } from '../../Shared/Types/formObject';

import {
	addImage,
	changeImageComment,
	changeImagePicture,
	deleteImage,
	moveImage,
	selectImage,
	setContextMenuObject,
	setContextMenuObjectForCopy,
	setPasteCoord,
} from './events';
import { FormContextMenuModel } from './types';

const initialState: FormContextMenuModel = {
	object: null,
	selectedImageId: 0,
	objectsForCopy: [],
	pasteCoord: { x: null, y: null },
};

export const $formContextMenu = createStore<FormContextMenuModel>(initialState);

$formContextMenu.on(setContextMenuObject, (state, object) => {
	return {
		...state,
		object,
	};
});

$formContextMenu.on(setContextMenuObjectForCopy, (state, objects) => {
	return {
		...state,
		objectsForCopy: [...objects],
	};
});

$formContextMenu.on(changeImageComment, (state, payload) => {
	const { imageId, comment } = payload;
	const { object } = state;
	const { images } = object as DynamicObjectConfiguration;
	const newImages = images.map((img) => {
		if (img.fileNumber !== imageId) {
			return img;
		}
		return {
			...img,
			comment,
		};
	});
	const newObject: DynamicObjectConfiguration = {
		...(object as DynamicObjectConfiguration),
		images: newImages,
	};

	return {
		...state,
		object: newObject,
	};
});

$formContextMenu.on(moveImage, (state, payload) => {
	const { from, to } = payload;
	const { object } = state;
	const { images } = object as DynamicObjectConfiguration;
	const imagesCopy = [...images];
	/// remove image that we want to move from an array
	const movedImage = imagesCopy.splice(from, 1)[0];
	// insert it on the new position
	imagesCopy.splice(to, 0, movedImage);
	// update images number
	const updatedImages = imagesCopy.map((image, idx) => ({
		...image,
		fileNumber: idx + 1,
	}));
	const newObject: DynamicObjectConfiguration = {
		...(object as DynamicObjectConfiguration),
		images: updatedImages,
	};
	return {
		...state,
		object: newObject,
	};
});

$formContextMenu.on(addImage, (state, image) => {
	const { object } = state;
	const { images } = object as DynamicObjectConfiguration;
	const newImages = [
		...images,
		{
			...image,
		},
	];
	const newObject: DynamicObjectConfiguration = {
		...(object as DynamicObjectConfiguration),
		images: newImages,
	};
	return {
		...state,
		object: newObject,
	};
});

$formContextMenu.on(deleteImage, (state, fileNumber) => {
	const { object } = state;
	const { images } = object as DynamicObjectConfiguration;
	const newImages = images
		.filter((img) => img.fileNumber !== fileNumber)
		.map((img, idx) => ({
			...img,
			fileNumber: idx + 1,
		}));
	const newObject: DynamicObjectConfiguration = {
		...(object as DynamicObjectConfiguration),
		images: newImages,
	};
	return {
		...state,
		object: newObject,
	};
});

$formContextMenu.on(selectImage, (state, id) => {
	return {
		...state,
		selectedImageId: id,
	};
});

$formContextMenu.on(changeImagePicture, (state, payload) => {
	const { id, image } = payload;
	const { object } = state;
	const { images } = object as DynamicObjectConfiguration;
	const newImages = images.map((img) => {
		if (img.fileNumber !== id) {
			return img;
		}
		return {
			...img,
			url: image.binary || '',
			fileName: image.name,
		};
	});
	const newObject: DynamicObjectConfiguration = {
		...(object as DynamicObjectConfiguration),
		images: newImages,
	};
	return {
		...state,
		object: newObject,
	};
});

$formContextMenu.on(setPasteCoord, (state, coords) => {
	return {
		...state,
		pasteCoord: { ...coords },
	};
});
