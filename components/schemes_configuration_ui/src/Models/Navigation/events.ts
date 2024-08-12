import { createEvent } from 'effector';

import { NavigationModel } from './types';

export const setActiveVersionId = createEvent<number>('setActiveVersionId');
export const setActiveFormId = createEvent<number | undefined>();
export const setNavigation =
	createEvent<Partial<NavigationModel>>('setNavigation');
export const setDiagnosticId = createEvent<number>();
