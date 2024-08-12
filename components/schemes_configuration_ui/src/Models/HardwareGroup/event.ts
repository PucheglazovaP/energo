import { createEvent } from 'effector';

import {
	HardwareGroupListOptions,
	OptimizedPagination,
} from '../../Shared/types';

import { GroupListItem, SortingItem, SortingValueNameEd } from './types';

export const setGroupList = createEvent<GroupListItem[]>();
export const fetchGroupList = createEvent<HardwareGroupListOptions>();
export const setScrollPosition = createEvent<number | null>();
export const setFilter = createEvent<SortingItem>();
export const setFilterVNEd = createEvent<SortingValueNameEd>();
export const setRequestData = createEvent<HardwareGroupListOptions>();
export const setSearchInfo = createEvent<{
	value: string;
	filterMode: number;
}>();
export const setPaginationInfo = createEvent<OptimizedPagination>();
export const resetGroupsState = createEvent();
