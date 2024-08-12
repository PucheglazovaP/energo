import { createEvent } from 'effector';

import { OptimizedPagination } from '../../Shared/types';
import { TreeItem } from '../../UI/Tree/types';

import { Channel } from './types';

export const setChannelsIsLoading = createEvent<boolean>();
export const addChannelsList = createEvent<Channel[]>();
export const clearChannelsList = createEvent();
export const setChannelsList = createEvent<Channel[]>();
export const clearChannelsPagination = createEvent();
export const setChannelsPagination =
	createEvent<Partial<OptimizedPagination>>();
export const setChannelsActiveNode = createEvent<TreeItem | undefined>();
export const setChannelsSearch = createEvent<string>();
export const toggleChannelsNode = createEvent<TreeItem>();
