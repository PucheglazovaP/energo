import { createEvent } from 'effector';

import { InputFormDataset } from '../InputForm/types';

import { EditRow } from './types';

export const setEditDataset = createEvent<InputFormDataset[]>();

export const updateEditDataset = createEvent<InputFormDataset[]>();

export const setActiveSessionId = createEvent<number>();

export const setEditRow = createEvent<EditRow>();
