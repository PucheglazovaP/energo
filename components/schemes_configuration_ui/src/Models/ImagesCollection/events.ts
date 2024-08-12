import { createEvent } from 'effector';

import { Image } from './types';

export const setImagesCollectionIsLoading = createEvent<boolean>();
export const setImagesCollectionList = createEvent<Image[]>();
