import { createEvent } from 'effector';

import { FormSettingsModel } from './types';

export const setFormSettings = createEvent<Partial<FormSettingsModel>>();

export const disableEditMode = createEvent();
