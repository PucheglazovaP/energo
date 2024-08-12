import { createStore } from 'effector';

import {
	HardwareGroupListOptions,
	OptimizedPagination,
} from './../../Shared/types';
import { fetchGroupListFx } from './effects';
import {
	fetchGroupList,
	resetGroupsState,
	setFilter,
	setFilterVNEd,
	setGroupList,
	setPaginationInfo,
	setRequestData,
	setScrollPosition,
	setSearchInfo,
} from './event';
import { GroupListItem, SortingItem, SortingValueNameEd } from './types';

export const $groups = createStore<GroupListItem[]>([]);
export const $pagination = createStore<OptimizedPagination>({
	positionRow: 0,
	pageTotalCount: 1,
	pageNumber: 1,
	rowsPerPage: 30,
});
export const $sortingVNEd = createStore<SortingValueNameEd>({
	sortingV: 2,
	sortingN: 4,
	sortingEd: 6,
});
export const $sorting = createStore<SortingItem>({
	searchValue: '',
	searchName: '',
});
export const $searchInfo = createStore<{
	value: string;
	filterMode: number;
}>({
	value: '',
	filterMode: 1,
});
export const $requestData = createStore<HardwareGroupListOptions>({
	pageNumber: 0,
	pageRowCount: 30,
	filterStr: null,
	fkChannel: null,
	serverId: 2,
	filterMode: 1,
	orderMode: 1,
	mode: 1,
	userId: '',
});

export const $hardwareGroupScrollPosition = createStore<number | null>(null);

$hardwareGroupScrollPosition.reset(resetGroupsState);
$requestData.reset(resetGroupsState);
$searchInfo.reset(resetGroupsState);
$sorting.reset(resetGroupsState);
$sortingVNEd.reset(resetGroupsState);
$pagination.reset(resetGroupsState);
$groups.reset(resetGroupsState);

$groups.on(setGroupList, (state, list) => {
	if (JSON.stringify(state) === JSON.stringify(list)) return state;

	return list;
});
fetchGroupList.watch(
	({
		pageNumber,
		pageRowCount,
		filterStr,
		fkChannel,
		serverId,
		filterMode,
		orderMode,
		mode,
		userId,
	}) => {
		fetchGroupListFx({
			pageNumber,
			pageRowCount,
			filterStr,
			fkChannel,
			serverId,
			filterMode,
			orderMode,
			mode,
			userId,
		});
	},
);

$hardwareGroupScrollPosition.on(
	setScrollPosition,
	(_, scrollPosition) => scrollPosition,
);

$sorting.on(setFilter, (state, filter) => filter);
$searchInfo.on(setSearchInfo, (state, info) => info);

$sortingVNEd.on(setFilterVNEd, (state, tree) => tree);

$requestData.on(setRequestData, (state, requestData) => requestData);

$pagination.on(setPaginationInfo, (state, pagination) => pagination);
