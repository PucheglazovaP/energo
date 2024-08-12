import { createEvent } from 'effector';

import { InputFormDataset } from './types';

export const setDataset = createEvent<InputFormDataset[]>();

export const toggleRefresh = createEvent<void>();
