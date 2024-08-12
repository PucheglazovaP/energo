import { createEvent } from 'effector';

import { PicturesDynamicProps } from './types';

export const setPicturesDynamicObject = createEvent();
export const setPicturesDynamic = createEvent<PicturesDynamicProps>();
