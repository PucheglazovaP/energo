import { createEvent } from 'effector';

import { InputFormHeader } from '../InputFormHeader/types';

import { PointLogBookBodyList, SavePointLogBookValue } from './types';

export const setPointLogBookHeaderEvent = createEvent<InputFormHeader[]>();

export const setPointLogBookBodyEvent = createEvent<PointLogBookBodyList[]>();

export const setPointLogBookIsLoadingEvent = createEvent<boolean>();

export const savePointLogBookValueEvent = createEvent<SavePointLogBookValue>();
