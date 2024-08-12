import React, {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';

import { getDataExportItems } from '../../Components/TreeBlockContent/utils';
import { FiltersTitle } from '../../Containers/ListContainer/types';
import { selectUser } from '../../Store/reducers/AuthSlice/authSelectors';
import {
	selectCurrentServer,
	selectPaginations,
} from '../../Store/reducers/ConfiguratorSlice/configuratorSelectors';
import { selectActiveFilters } from '../../Store/reducers/FiltersSlice/filtersSelectors';
import { getReportLinkPromise } from '../../Store/reducers/Reports/ReportLinkActions';
import { selectSortOrders } from '../../Store/reducers/SortSlice/sortSelectors';
import { ReportLinkType } from '../../Types';
import { ContextMenuPosition } from '../../UI/ContextMenu/types';
import { useAppSelector } from '../Store/useAppSelector';
import { useOnClickOutside } from '../useOnClickOutside';

export function useTreeMenu(filterHeader: FiltersTitle) {
	const server = useAppSelector(selectCurrentServer);
	const user = useAppSelector(selectUser);
	const { groupsActiveFilter, devicesActiveFilter } =
		useAppSelector(selectActiveFilters);
	const { groupPagination, devicePagination, unusedChannelsPagination } =
		useAppSelector(selectPaginations);
	const { devicesSortOrder, unusedChannelsSortOrder, groupsSortOrder } =
		useAppSelector(selectSortOrders);

	const [reportLinks, setReportLinks] = useState({
		groupListReportLink: '',
		groupsAndChannelsListReportLink: '',
		channelsAndGroupsUsingThoseChannelsListReportLink: '',
		analyticRangesReportLink: '',
		devicesListReportLink: '',
		devicesAndChannelsListReportLink: '',
		unusedChannelsListReportLink: '',
	});

	const exportParameters = useMemo(() => {
		switch (filterHeader) {
			case FiltersTitle.GROUPS: {
				return {
					mode: groupsActiveFilter,
					filterMode: groupPagination.filterMode,
					filterStr: groupPagination.filterString,
					sortOrder: groupsSortOrder,
					reportLinks,
				};
			}

			case FiltersTitle.DEVICES:
				return {
					mode: devicesActiveFilter,
					filterMode: devicePagination.filterMode,
					filterStr: devicePagination.filterString,
					sortOrder: devicesSortOrder,
					reportLinks,
				};
			case FiltersTitle.UNUSED_CHANNELS:
				return {
					mode: groupsActiveFilter,
					filterMode: unusedChannelsPagination.filterMode,
					filterStr: unusedChannelsPagination.filterString,
					sortOrder: unusedChannelsSortOrder,
					reportLinks,
				};
		}
	}, [
		groupsActiveFilter,
		devicesActiveFilter,
		groupPagination,
		devicePagination,
		unusedChannelsPagination,
		server,
		user,
		filterHeader,
		reportLinks,
	]);
	const menuItems = useMemo(() => {
		const { filterMode, filterStr, mode, sortOrder, reportLinks } =
			exportParameters;
		return getDataExportItems(filterHeader, {
			ID_DataServers: server,
			ID_User: user?.preferredUsername,
			Mode: mode,
			FilterMode: filterMode,
			OrderMode: sortOrder,
			FilterStr: filterStr ? filterStr : ' ',
			reportLinks,
		});
	}, [exportParameters]);

	const [position, setPosition] = useState<ContextMenuPosition | null>(null);
	const handleContextMenu = (
		evt: React.MouseEvent<HTMLButtonElement> | TouchEvent,
	) => {
		evt.stopPropagation();
		if (!position) setPosition({ x: 10, y: 42 });
		else setPosition(null);
	};

	const closeContextMenu = useCallback(() => {
		setPosition(null);
	}, []);
	const ref = useRef(null);
	useOnClickOutside(ref, closeContextMenu);

	useEffect(() => {
		getReportLinkPromise(ReportLinkType.GroupList).then((groupListReportLink) =>
			setReportLinks((state) => ({ ...state, groupListReportLink })),
		);
		getReportLinkPromise(ReportLinkType.GroupsAndChannelsList).then(
			(groupsAndChannelsListReportLink) =>
				setReportLinks((state) => ({
					...state,
					groupsAndChannelsListReportLink,
				})),
		);
		getReportLinkPromise(
			ReportLinkType.ChannelsAndGroupsUsingThoseChannelsList,
		).then((channelsAndGroupsUsingThoseChannelsListReportLink) =>
			setReportLinks((state) => ({
				...state,
				channelsAndGroupsUsingThoseChannelsListReportLink,
			})),
		);
		getReportLinkPromise(ReportLinkType.AnalyticRanges).then(
			(analyticRangesReportLink) =>
				setReportLinks((state) => ({ ...state, analyticRangesReportLink })),
		);
		getReportLinkPromise(ReportLinkType.DevicesList).then(
			(devicesListReportLink) =>
				setReportLinks((state) => ({ ...state, devicesListReportLink })),
		);
		getReportLinkPromise(ReportLinkType.DevicesAndChannelsList).then(
			(devicesAndChannelsListReportLink) =>
				setReportLinks((state) => ({
					...state,
					devicesAndChannelsListReportLink,
				})),
		);
		getReportLinkPromise(ReportLinkType.UnusedChannelsList).then(
			(unusedChannelsListReportLink) =>
				setReportLinks((state) => ({ ...state, unusedChannelsListReportLink })),
		);
	}, []);

	return {
		handleContextMenu,
		menuItems,
		position,
		setPosition,
		ref,
	};
}
