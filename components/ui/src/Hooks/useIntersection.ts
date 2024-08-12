import { RefObject, useEffect, useMemo, useState } from 'react';

import { FORWARD_TREE, REVERSE_TREE, UNUSED_CHANNELS_TREE } from '../Const';
import { TreeType } from '../Types';

import { useAppSelector } from './Store/useAppSelector';

const useIntersection = (el: RefObject<HTMLDivElement>, treeType: TreeType) => {
	const [isVisible, setIsVisible] = useState(false);
	const {
		isGroupsListFetching,
		isUnusedChannelsListFetching,
		isDevicesListFetching,
	} = useAppSelector((state) => state.configuratorReducer);

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

	useEffect(() => {
		if (!isListFetching) {
			const observer = new IntersectionObserver(([entry]) => {
				setIsVisible(entry.isIntersecting);
			});
			if (el.current) observer.observe(el.current);

			return () => observer.disconnect();
		}
	}, [isListFetching, el]);
	return isVisible;
};

export default useIntersection;
