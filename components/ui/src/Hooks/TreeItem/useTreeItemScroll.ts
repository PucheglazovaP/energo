import { createRef, useEffect, useMemo } from 'react';

import { FORWARD_TREE, REVERSE_TREE, UNUSED_CHANNELS_TREE } from '../../Const';
import {
	setNeedToScrollDevices,
	setNeedToScrollGroups,
	setNeedToScrollUnusedChannels,
	setScrollbarPositionChannelsInDevices,
	setScrollbarPositionDevices,
	setScrollbarPositionGroups,
	setScrollbarPositionUnusedChannels,
} from '../../Store/reducers/ConfiguratorSlice/configuratorSlice';
import { TreeType } from '../../Types';
import useAppDispatch from '../Store/useAppDispatch';
import { useAppSelector } from '../Store/useAppSelector';

export default function useTreeItemScroll(treeType: TreeType) {
	const dispatch = useAppDispatch();
	const {
		groupPagination,
		devicePagination,
		unusedChannelsPagination,
		groupsList,
		devicesList,
		unusedChannelsList,
	} = useAppSelector((state) => state.configuratorReducer);
	const scrollRef = createRef<HTMLDivElement>();

	const currentList = useMemo(() => {
		switch (treeType) {
			case FORWARD_TREE:
				return groupsList;
			case REVERSE_TREE:
				return devicesList;
			case UNUSED_CHANNELS_TREE:
				return unusedChannelsList;
		}
	}, [groupsList, unusedChannelsList, devicesList, treeType]);

	const currentTreePagination = useMemo(() => {
		switch (treeType) {
			case FORWARD_TREE:
				return groupPagination;
			case REVERSE_TREE:
				return devicePagination;
			case UNUSED_CHANNELS_TREE:
				return unusedChannelsPagination;
		}
	}, [groupPagination, devicePagination, unusedChannelsPagination, treeType]);

	const devicesFilterModeChannels = devicePagination.filterMode === 3;

	const setNeedToScroll = useMemo(() => {
		switch (treeType) {
			case FORWARD_TREE:
				return setNeedToScrollGroups;
			case REVERSE_TREE:
				return setNeedToScrollDevices;
			case UNUSED_CHANNELS_TREE:
				return setNeedToScrollUnusedChannels;
		}
	}, [treeType]);

	const setScrollbarPosition = useMemo(() => {
		switch (treeType) {
			case FORWARD_TREE:
				return setScrollbarPositionGroups;
			case REVERSE_TREE:
				return devicesFilterModeChannels
					? setScrollbarPositionChannelsInDevices
					: setScrollbarPositionDevices;
			case UNUSED_CHANNELS_TREE:
				return setScrollbarPositionUnusedChannels;
		}
	}, [treeType, devicesFilterModeChannels]);

	useEffect(() => {
		if (
			currentTreePagination.needToScroll &&
			!currentTreePagination.scrollbarPosition &&
			!devicesFilterModeChannels
		) {
			scrollRef.current?.scrollTo({ top: 1275 });
			dispatch(setNeedToScroll(false));
		}
	}, [currentList]);

	useEffect(() => {
		if (currentTreePagination.scrollbarPosition) {
			scrollRef.current?.scrollTo({
				top: currentTreePagination.scrollbarPosition,
			});
			dispatch(setScrollbarPosition(null));
			dispatch(setNeedToScroll(false));
		}
	}, [currentTreePagination.scrollbarPosition]);

	return scrollRef;
}
