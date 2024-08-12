import { createEvent } from 'effector';

export const changeFormRoute = createEvent<string>('changeRoute');
export const deleteFormLastRoute = createEvent('deleteLastRoute');
export const setFormNavigationHistory = createEvent<string[]>();

export const changeDeviceRoute = createEvent<string>('changeRoute');
export const deleteDeviceLastRoute = createEvent('deleteLastRoute');
export const setDeviceNavigationHistory = createEvent<string[]>();

export const changeChannelRoute = createEvent<string>('changeRoute');
export const deleteChannelLastRoute = createEvent('deleteLastRoute');
export const setChannelNavigationHistory = createEvent<string[]>();

export const resetNavigationHistory = createEvent();
