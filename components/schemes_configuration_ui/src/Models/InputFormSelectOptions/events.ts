import { createEvent } from 'effector';

import { InputFormSelectOptions } from './types';

export const setSelectOptions = createEvent<InputFormSelectOptions[]>();
