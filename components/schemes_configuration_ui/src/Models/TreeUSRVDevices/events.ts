import { createEvent } from 'effector';

export const setSearchValue = createEvent<string>(
	'Set value of USRV devices list context search',
);
export const resetSearchValue = createEvent<void>(
	'Set value of USRV devices list context search',
);
