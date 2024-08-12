import { createEvent } from 'effector';

import {
	DynamicObjectValue,
	FormObjectConfiguration,
} from '../../Shared/Types/formObject';
import { Image } from '../ImagesCollection/types';

import { FormContextMenuObject } from './types';

export const setContextMenuObject = createEvent<FormContextMenuObject>();
export const setContextMenuObjectById = createEvent<number>();
export const setContextMenuObjectForCopy =
	createEvent<FormObjectConfiguration[]>();

export const changeImageComment = createEvent<{
	imageId: number;
	comment: string;
}>();

export const moveImage = createEvent<{
	from: number;
	to: number;
}>();

export const addImage = createEvent<DynamicObjectValue>();

export const deleteImage = createEvent<number>();

export const selectImage = createEvent<number>();

export const changeImagePicture = createEvent<{ id: number; image: Image }>();

export const setPasteCoord = createEvent<{
	x: number;
	y: number;
}>();

export const copyTransparent = createEvent<{
	x: number;
	y: number;
	objectId: number;
	userId: string;
}>();
export const copyDynamicObject = createEvent<{
	x: number;
	y: number;
	objectId: number;
	userId: string;
}>();
export const copyStatusIndicator = createEvent<{
	x: number;
	y: number;
	objectId: number;
	userId: string;
}>();
export const switchToSubForm = createEvent<number>();
