import { createEvent } from 'effector';

import { InputFormPointsDataset } from '../InputFormPoints/types';

import { EditInputFormPointParameter } from './types';

export const setEditPoints = createEvent<InputFormPointsDataset>();

export const setPointActiveSessionId = createEvent<number>();

export const setEditParameter = createEvent<EditInputFormPointParameter>();
