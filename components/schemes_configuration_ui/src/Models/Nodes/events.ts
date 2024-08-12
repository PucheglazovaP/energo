import { createEvent } from 'effector';

import { TreeItem } from '../../UI/Tree/types';

import { NSINode } from './types';

export const setNodesList = createEvent<NSINode[]>();
export const addNodesList = createEvent<NSINode[]>();
export const clearNodesList = createEvent();

export const setNodesActiveNode = createEvent<TreeItem | undefined>();
export const toggleNodesActiveNode = createEvent<TreeItem>();
export const openNodeById = createEvent<number>();
