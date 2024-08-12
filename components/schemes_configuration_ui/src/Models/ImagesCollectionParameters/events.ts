import { createEvent } from 'effector';

import { CollectionType, FormParameters } from './types';

export const setType = createEvent<CollectionType>();
export const toggleImage = createEvent<number>();
export const switchImage = createEvent<number>();
export const resetCheckedImages = createEvent();
export const setPreviewImage = createEvent<string>();
export const setFormParameters = createEvent<FormParameters | null>();
