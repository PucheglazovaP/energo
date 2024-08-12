import { createEvent } from 'effector';

import { DeviceHealthiness } from './types';

export const setDevices = createEvent<DeviceHealthiness[]>();
export const toggleExpandDevice = createEvent<number>();
export const collapseDevices = createEvent();
