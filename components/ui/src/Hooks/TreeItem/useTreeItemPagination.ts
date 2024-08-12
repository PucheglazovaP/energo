import { createRef, useEffect, useMemo, useState } from 'react';

import {
	FORWARD_TREE,
	REVERSE_TREE,
	SERVER,
	UNUSED_CHANNELS_TREE,
} from '../../Const';
import { addElementsLists } from '../../Store/reducers/ConfiguratorSlice/configuratorActions';
import {
	setDevicesFirstFetching,
	setGroupsFirstFetching,
	setUnusedChannelsFirstFetching,
} from '../../Store/reducers/ConfiguratorSlice/configuratorSlice';
import { TreeItemType, TreeType } from '../../Types';
import useAppDispatch from '../Store/useAppDispatch';
import { useAppSelector } from '../Store/useAppSelector';
import useIntersection from '../useIntersection';

export default function useTreeItemPagination(
	serverNumber: number,
	treeType: TreeType,
	treeItemType: TreeItemType,
) {
	const dispatch = useAppDispatch();
	const {
		isGroupsListFetching,
		isUnusedChannelsListFetching,
		isDevicesListFetching,
	} = useAppSelector((state) => state.configuratorReducer);

	const bottomRef = createRef<HTMLInputElement>();
	const topRef = createRef<HTMLInputElement>();

	const inViewpointBottom = useIntersection(bottomRef, treeType);
	const inViewpointTop = useIntersection(topRef, treeType);

	const isListFetching = useMemo(() => {
		switch (treeType) {
			case FORWARD_TREE:
				return isGroupsListFetching;
			case REVERSE_TREE:
				return isDevicesListFetching;
			case UNUSED_CHANNELS_TREE:
				return isUnusedChannelsListFetching;
		}
	}, [
		isGroupsListFetching,
		isDevicesListFetching,
		isUnusedChannelsListFetching,
		treeType,
	]);

	const { groupPagination, devicePagination, unusedChannelsPagination } =
		useAppSelector((state) => state.configuratorReducer);

	const currentPagination = useMemo(() => {
		switch (treeType) {
			case FORWARD_TREE:
				return groupPagination;
			case REVERSE_TREE:
				return devicePagination;
			case UNUSED_CHANNELS_TREE:
				return unusedChannelsPagination;
		}
	}, [groupPagination, devicePagination, unusedChannelsPagination, treeType]);

	const paginationAvailable = useMemo(
		() => currentPagination.paginationAvailable,
		[currentPagination],
	);
	const firstFetching = useMemo(
		() => currentPagination.isFirstFetching,
		[currentPagination],
	);

	const setEntityFirstFetching = useMemo(() => {
		switch (treeType) {
			case FORWARD_TREE:
				return setGroupsFirstFetching;
			case REVERSE_TREE:
				return setDevicesFirstFetching;
			case UNUSED_CHANNELS_TREE:
				return setUnusedChannelsFirstFetching;
		}
	}, [treeType]);

	const [firstFetch, setFirstFetch] = useState(true);
	useEffect(() => {
		if (firstFetching && treeItemType === SERVER && firstFetch) {
			setTimeout(() => {
				dispatch(setEntityFirstFetching(false));
				setFirstFetch(false);
			}, 1000);
		}
	}, [firstFetch]);

	useEffect(() => {
		if (
			!firstFetching &&
			(inViewpointBottom || inViewpointTop) &&
			!isListFetching &&
			paginationAvailable
		) {
			dispatch(
				addElementsLists(
					treeItemType,
					treeType,
					serverNumber,
					inViewpointBottom,
				),
			);
		}
	}, [inViewpointBottom, inViewpointTop]);

	return { currentPagination, isListFetching, topRef, bottomRef };
}
