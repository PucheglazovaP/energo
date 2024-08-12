import { createEvent } from 'effector';

import { FormTab } from '../FormTabs/types';

export const setWidgetData = createEvent<Partial<FormTab>>();
export const setWidgetOpen = createEvent<boolean>();
export const resetWidget = createEvent();
