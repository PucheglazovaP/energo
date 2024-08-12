import { createEvent } from 'effector';

import { TreeItem } from '../../UI/Tree/types';

import { Server } from './types';

export const setServersList = createEvent<Server[]>();
export const setServersIsLoading = createEvent<boolean>();
export const toggleServersNode = createEvent<TreeItem>();
export const setActiveServer = createEvent<number>();
export const selectActiveServer = createEvent<number>();
export const rollupServersNodes = createEvent();
export const resetServersModel = createEvent();
