import { createEvent } from 'effector';

import { SelectOption } from '../../UI/Select/types';

export const setSearchValue = createEvent<string>();
export const setSearchOptions = createEvent<SelectOption[]>();
