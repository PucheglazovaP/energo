import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
	CHANNEL,
	DEVICE,
	FORWARD_TREE,
	GROUP,
	REVERSE_TREE,
	UNUSED_CHANNELS_TREE,
} from '../../Const';
import { positionOnElement } from '../../Store/reducers/ConfiguratorSlice/configuratorActions';
import { selectConfiguratorPagination } from '../../Store/reducers/ConfiguratorSlice/configuratorSelectors';
import { selectActiveFilters } from '../../Store/reducers/FiltersSlice/filtersSelectors';
import { selectSortOrders } from '../../Store/reducers/SortSlice/sortSelectors';
import {
	setDevicesSortOrder,
	setGroupsSortOrder,
	setUnusedChannelsSortOrder,
} from '../../Store/reducers/SortSlice/SortSlice';
import { SortOrderMode } from '../../Store/reducers/SortSlice/types';
import { TreeType } from '../../Types';
import useAppDispatch from '../Store/useAppDispatch';
import { useAppSelector } from '../Store/useAppSelector';

export function useSortTree(treeType: TreeType) {
	const dispatch = useAppDispatch();
	const { unusedChannelsSortOrder, groupsSortOrder, devicesSortOrder } =
		useAppSelector(selectSortOrders);
	const { groupPagination, devicePagination, unusedChannelsPagination } =
		useAppSelector(selectConfiguratorPagination);
	const { devicesActiveFilter, groupsActiveFilter } =
		useAppSelector(selectActiveFilters);
	const firstUpdate = useRef(true);

	const isForwardTree = useMemo(() => treeType === FORWARD_TREE, [treeType]);
	const currentPagination = useMemo(() => {
		switch (treeType) {
			case FORWARD_TREE:
				return groupPagination;
			case REVERSE_TREE:
				return devicePagination;
			case UNUSED_CHANNELS_TREE:
				return unusedChannelsPagination;
		}
	}, [treeType, groupPagination, devicePagination, unusedChannelsPagination]);

	const sortOrder = useMemo(() => {
		switch (treeType) {
			case FORWARD_TREE:
				return groupsSortOrder;
			case REVERSE_TREE:
				return devicesSortOrder;
			case UNUSED_CHANNELS_TREE:
				return unusedChannelsSortOrder;
		}
	}, [treeType, groupsSortOrder, devicesSortOrder, unusedChannelsSortOrder]);

	const setSortOrderModeFunction = useCallback(() => {
		switch (treeType) {
			case FORWARD_TREE:
				return setGroupsSortOrder;
			case REVERSE_TREE:
				return setDevicesSortOrder;
			case UNUSED_CHANNELS_TREE:
				return setUnusedChannelsSortOrder;
		}
	}, [treeType])();

	const [isFirstSortModeActive, setSortModeActive] = useState(false);

	const setSortOrderMode = useCallback(
		(sortOrder: SortOrderMode) => () => {
			if (!isFirstSortModeActive) setSortModeActive(true);
			dispatch(setSortOrderModeFunction(sortOrder));
		},
		[isFirstSortModeActive],
	);

	const mode = useMemo(
		() => (isForwardTree ? groupsActiveFilter : devicesActiveFilter),
		[groupsActiveFilter, devicesActiveFilter, isForwardTree],
	);
	useEffect(() => {
		if (firstUpdate.current) {
			firstUpdate.current = false;
			return;
		}
		dispatch(
			positionOnElement(
				String(currentPagination.filterString),
				currentPagination.filterMode,
				treeType === FORWARD_TREE
					? GROUP
					: treeType === REVERSE_TREE
					? DEVICE
					: CHANNEL,
				mode,
			),
		);
	}, [sortOrder]);

	return {
		sortOrder,
		setSortOrderMode,
		isFirstSortModeActive,
	};
}
