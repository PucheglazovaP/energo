import { createEvent } from 'effector';

export const setActiveLinkedParameterIdEvent = createEvent<number | null>(
	'set setActiveLinkedParameterIdEvent',
);
