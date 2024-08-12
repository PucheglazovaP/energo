import { createEvent } from 'effector';

import { TreeItem } from '../../UI/Tree/types';

import { NSINodeItem } from './types';

export const setNodeItemsList = createEvent<NSINodeItem[]>();
export const addNodeItemsList = createEvent<NSINodeItem[]>();
export const clearNodeItemsList = createEvent();

export const setNodeItemsActiveNode = createEvent<TreeItem | undefined>();
export const toggleNodeItemsActiveNode = createEvent<TreeItem>();
export const openNodeItemNode = createEvent<TreeItem>();
