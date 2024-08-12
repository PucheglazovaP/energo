import { useCallback, useEffect, useMemo, useRef } from 'react';

import { DEVICE, GROUP } from '../../Const';
import { FiltersTitle } from '../../Containers/ListContainer/types';
import { positionOnElement } from '../../Store/reducers/ConfiguratorSlice/configuratorActions';
import {
	setDevicesFilterMode,
	setDevicesFilterString,
	setGroupsFilterMode,
	setGroupsFilterString,
} from '../../Store/reducers/ConfiguratorSlice/configuratorSlice';
import {
	setDevicesActiveFilter,
	setGroupsActiveFilter,
} from '../../Store/reducers/FiltersSlice/filtersSlice';
import {
	setDevicesSortOrder,
	setGroupsSortOrder,
	setUnusedChannelsSortOrder,
} from '../../Store/reducers/SortSlice/SortSlice';
import { SortOrderMode } from '../../Store/reducers/SortSlice/types';
import { ContentHeader } from '../../Types';
import useAppDispatch from '../Store/useAppDispatch';
import { useAppSelector } from '../Store/useAppSelector';

export const useConfiguratorHeaderFilters = (filterHeader: ContentHeader) => {
	const dispatch = useAppDispatch();
	const { groupsActiveFilter, devicesActiveFilter } = useAppSelector(
		(state) => state.filtersReducer,
	);
	const { groupPagination, devicePagination } = useAppSelector(
		(state) => state.configuratorReducer,
	);
	const isForwardTree = useMemo(
		() => filterHeader.title === FiltersTitle.GROUPS,
		[filterHeader.title],
	);
	const currentPagination = useMemo(
		() => (isForwardTree ? groupPagination : devicePagination),
		[groupPagination, devicePagination, isForwardTree],
	);

	const activeFilter = useMemo(() => {
		if (isForwardTree) {
			return groupsActiveFilter;
		} else return devicesActiveFilter;
	}, [groupsActiveFilter, devicesActiveFilter, isForwardTree]);

	const setActiveFilter = useMemo(() => {
		if (isForwardTree) {
			return setGroupsActiveFilter;
		} else return setDevicesActiveFilter;
	}, [isForwardTree]);

	const setFilterMode = useMemo(() => {
		if (isForwardTree) {
			return setGroupsFilterMode;
		} else return setDevicesFilterMode;
	}, [isForwardTree]);

	const setFilterString = useMemo(() => {
		if (isForwardTree) {
			return setGroupsFilterString;
		} else return setDevicesFilterString;
	}, [isForwardTree]);

	const setSortOrder = useMemo(() => {
		if (isForwardTree) {
			return setGroupsSortOrder;
		} else return setDevicesSortOrder;
	}, [isForwardTree]);

	const handleRefreshClick = useCallback(() => {
		dispatch(setFilterString(''));
		dispatch(setFilterMode(1));
		dispatch(setActiveFilter(1));

		dispatch(setSortOrder(SortOrderMode.NUMBER_FORWARD));
		if (!isForwardTree)
			setUnusedChannelsSortOrder(SortOrderMode.NUMBER_FORWARD);
	}, [setFilterMode, setActiveFilter, setFilterString, dispatch]);

	const handleFilterItemClick = useCallback(
		(itemIndex: number) => () => {
			dispatch(setActiveFilter(itemIndex + 1));
		},
		[dispatch],
	);
	const firstUpdate = useRef(true);

	useEffect(() => {
		if (firstUpdate.current) {
			firstUpdate.current = false;
			return;
		}
		dispatch(
			positionOnElement(
				String(currentPagination.filterString),
				currentPagination.filterMode,
				isForwardTree ? GROUP : DEVICE,
				activeFilter,
			),
		);
	}, [activeFilter]);

	return {
		handleRefreshClick,
		handleFilterItemClick,
		activeFilter,
	};
};
