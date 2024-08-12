import { createEvent } from 'effector';

import { Version } from './types';

export const setVersions = createEvent<Version[]>();
export const setVersionsIsLoading = createEvent<boolean>();
