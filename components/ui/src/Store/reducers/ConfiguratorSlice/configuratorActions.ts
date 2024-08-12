import { toast } from 'react-toastify';
import { ActionCreatorWithPayload } from '@reduxjs/toolkit';
import { IMessage } from '@stomp/stompjs';

import {
	CHANNEL,
	COMMON_PAGE_ROW_COUNT,
	DEVICE,
	FORWARD_TREE,
	GROUP,
	GROUP_NUMBER_FILTER_INDEX,
	REVERSE_TREE,
	SERVER,
	UNUSED_CHANNELS_TREE,
} from '../../../Const';
import { checkResponseOutputWarnings } from '../../../Shared/Utils/utils';
import {
	DevicesListItemType,
	GroupsListItemType,
	TreeItemType,
	TreeType,
} from '../../../Types';
import { rpcEndPoint } from '../../../WebSocket';
import { AppDispatch, RootState, rxStompRPC } from '../../store';
import {
	addParameterItems,
	removeParameterItems,
} from '../ParametersSlice/parametersSlice';
import { SortOrderMode } from '../SortSlice/types';

import { channelsListQuery } from './queries/channelsListQuery';
import { devicesListQuery } from './queries/devicesListQuery';
import { groupsListQuery } from './queries/groupsListQuery';
import { serversListQuery } from './queries/serverListQuery';
import {
	addTreeItemsToOpen,
	setChannelsInDevicesScrollAvailable,
	setDevicesBottomPageNumber,
	setDevicesList,
	setDevicesPageTotalCount,
	setDevicesPaginationAvailable,
	setDevicesTopPageNumber,
	setGroupsBottomPageNumber,
	setGroupsList,
	setGroupsPageTotalCount,
	setGroupsPaginationAvailable,
	setGroupsTopPageNumber,
	setIsDevicesListFetching,
	setIsGroupsListFetching,
	setIsUnusedChannelsListFetching,
	setNeedToScrollDevices,
	setNeedToScrollGroups,
	setNeedToScrollUnusedChannels,
	setServersList,
	setUnusedChannelsBottomPageNumber,
	setUnusedChannelsList,
	setUnusedChannelsPageTotalCount,
	setUnusedChannelsPaginationAvailable,
	setUnusedChannelsTopPageNumber,
	updateChannelsList,
	updateDevicesList,
	updateDevicesListChildren,
	updateGroupsList,
	updateGroupsListChildren,
	updateUnusedChannelsList,
} from './configuratorSlice';

export const positionOnElement =
	(
		searchString: string,
		filterMode: number,
		type: TreeItemType,
		mode: number,
	) =>
	(dispatch: AppDispatch, getState: () => RootState) => {
		const { configuratorReducer, authReducer, sortReducer } = getState();
		const serverId = configuratorReducer.currentServer;
		const userId = authReducer.user?.preferredUsername;
		const { groupsSortOrder, devicesSortOrder, unusedChannelsSortOrder } =
			sortReducer;

		const setPaginationAvailable = (() => {
			switch (type) {
				case GROUP:
					return setGroupsPaginationAvailable;
				case DEVICE:
					return setDevicesPaginationAvailable;
				case CHANNEL:
					return setUnusedChannelsPaginationAvailable;
				case SERVER:
					return setGroupsPaginationAvailable;
			}
		})();

		dispatch(setPaginationAvailable(false));
		switch (type) {
			case GROUP:
				dispatch(setIsGroupsListFetching(true));
				dispatch(removeParameterItems(GROUP));
				dispatch(
					fetchGroupsList(
						1,
						COMMON_PAGE_ROW_COUNT,
						searchString,
						null,
						serverId,
						false,
						filterMode,
						mode,
						groupsSortOrder,
						userId,
					),
				);
				break;

			case DEVICE:
				dispatch(setIsDevicesListFetching(true));
				dispatch(removeParameterItems(DEVICE));
				dispatch(
					fetchDeviceList(
						1,
						COMMON_PAGE_ROW_COUNT,
						searchString,
						serverId,
						false,
						filterMode,
						mode,
						devicesSortOrder,
						userId,
					),
				);
				if (filterMode === 3 && Number.isInteger(parseInt(searchString))) {
					dispatch(setIsUnusedChannelsListFetching(true));
					dispatch(removeParameterItems(CHANNEL));
					dispatch(
						fetchUnusedChannelsList(
							serverId,
							1,
							COMMON_PAGE_ROW_COUNT,
							false,
							unusedChannelsSortOrder,
							Number(searchString),
							userId,
						),
					);
					dispatch(setChannelsInDevicesScrollAvailable(true));
				}

				break;
			case CHANNEL:
				dispatch(setIsUnusedChannelsListFetching(true));
				dispatch(removeParameterItems(CHANNEL));
				dispatch(
					fetchUnusedChannelsList(
						serverId,
						1,
						COMMON_PAGE_ROW_COUNT,
						false,
						unusedChannelsSortOrder,
						Number(searchString),
						userId,
					),
				);

				break;
		}
	};

export const fetchDeviceList =
	(
		pageNumber: number,
		pageRowCount: number,
		filterStr: string | null,
		serverId: number | null,
		isNeedUpdateList: boolean,
		filterMode: number,
		mode: number,
		sortOrder: SortOrderMode,
		userId?: string,
	) =>
	(dispatch: AppDispatch) => {
		dispatch(setIsDevicesListFetching(true));
		try {
			rxStompRPC
				.rpc({
					destination: rpcEndPoint,
					body: JSON.stringify(
						devicesListQuery({
							pageNumber,
							pageRowCount,
							filterMode,
							filterStr,
							serverId,
							mode,
							userId,
							sortOrder,
						}),
					),
				})
				.subscribe(function (result: IMessage) {
					const response = JSON.parse(result.body).Response;
					const data = response.Tables[0].Rows;
					const pageNumberOut = response.OutParameters[0]['@PageNumberOut'];
					const pageTotalCount = response.OutParameters[0]['@PageTotalCount'];
					const selectRow = response.OutParameters[0]['@SelectRow'];

					dispatch(setDevicesPageTotalCount(Number(pageTotalCount)));
					dispatch(setDevicesBottomPageNumber(Number(pageNumberOut)));
					dispatch(setDevicesTopPageNumber(Number(pageNumberOut)));
					const device = data.find(
						(item: DevicesListItemType) => item.RowNumber === Number(selectRow),
					);
					const deviceNumber = device?.Number;
					if (deviceNumber) {
						dispatch(
							addParameterItems([
								{ parameterType: DEVICE, parameterId: deviceNumber },
							]),
						);
					}
					const filterModeChannels =
						filterMode === 3 && Number(filterStr) && filterStr !== '';

					dispatch(
						isNeedUpdateList
							? updateDevicesList({ elementsList: data, toBottom: true })
							: setDevicesList({
									devicesList: filterModeChannels
										? device
											? [device]
											: []
										: data,
									deviceNumber: filterModeChannels ? null : Number(filterStr),
							  }),
					);
					if (!!filterStr && !selectRow && !filterModeChannels) {
						if (filterMode !== 2) {
							if (!checkResponseOutputWarnings(result)) {
								dispatch(removeParameterItems(DEVICE));
							}
						} else if (!data.length) {
							dispatch(removeParameterItems(DEVICE));
							toast.warn(`Прибор ${filterStr} не найден`);
						}
					}
					if (filterModeChannels) {
						if (deviceNumber) {
							dispatch(
								addParameterItems([
									{ parameterId: deviceNumber, parameterType: DEVICE },
								]),
							);
							dispatch(
								addTreeItemsToOpen([
									{ itemNumber: Number(deviceNumber), itemType: DEVICE },
								]),
							);
							dispatch(
								addParameterItems([
									{ parameterType: CHANNEL, parameterId: Number(filterStr) },
								]),
							);
						}
					}
					dispatch(setIsDevicesListFetching(false));
					dispatch(
						setDevicesPaginationAvailable(!filterModeChannels || !device),
					);
				});
		} catch (e) {
			console.log(e);
		}
	};

export const fetchServersList =
	(userId?: string) => (dispatch: AppDispatch) => {
		try {
			rxStompRPC
				.rpc({
					destination: rpcEndPoint,
					body: JSON.stringify(serversListQuery({ userId })),
				})
				.subscribe(function (result: IMessage) {
					dispatch(
						setServersList(JSON.parse(result.body).Response.Tables[0].Rows),
					);
				});
		} catch (e) {
			console.log(e);
		}
	};
export const updateUnusedChannels =
	(
		serverId: number,
		fromNumber: number,
		toNumber: number,
		sortOrder: SortOrderMode,
		userId?: string,
	) =>
	(dispatch: AppDispatch) => {
		try {
			rxStompRPC
				.rpc({
					destination: rpcEndPoint,
					body: JSON.stringify(
						channelsListQuery({
							pageNumber: 1,
							pageRowCount: COMMON_PAGE_ROW_COUNT,
							mode: 3,
							serverId,
							fromNumber,
							toNumber,
							userId,
							sortOrder,
						}),
					),
				})
				.subscribe(function (result: IMessage) {
					const data = JSON.parse(result.body).Response.Tables[0].Rows;
					dispatch(
						updateUnusedChannelsList({ elementsList: data, toBottom: true }),
					);
				});
		} catch (e) {
			console.log(e);
		}
	};

export const fetchUnusedChannelsList =
	(
		serverId: number | null,
		pageNumber: number,
		pageRowCount: number,
		isNeedUpdateList: boolean,
		sortOrder: SortOrderMode,
		channelNumber?: number | null,
		userId?: string,
	) =>
	(dispatch: AppDispatch) => {
		try {
			rxStompRPC
				.rpc({
					destination: rpcEndPoint,
					body: JSON.stringify(
						channelsListQuery({
							pageNumber,
							pageRowCount,
							mode: 3,
							serverId,
							fkChannel: channelNumber,
							userId,
							sortOrder,
						}),
					),
				})
				.subscribe(function (result: IMessage) {
					const parsedResult = JSON.parse(result.body).Response;
					const data = parsedResult.Tables[0].Rows;
					const pageNumberOut = parsedResult.OutParameters[0]['@PageNumberOut'];
					const pageTotalCount =
						parsedResult.OutParameters[0]['@PageTotalCount'];
					const selectRow = parsedResult.OutParameters[0]['@SelectRow'];

					dispatch(setUnusedChannelsTopPageNumber(Number(pageNumberOut)));
					dispatch(setUnusedChannelsBottomPageNumber(Number(pageNumberOut)));
					dispatch(setUnusedChannelsPageTotalCount(pageTotalCount));
					dispatch(
						isNeedUpdateList
							? updateUnusedChannelsList({ elementsList: data, toBottom: true })
							: setUnusedChannelsList({
									unusedChannelsList: data,
									channelNumber: Number(channelNumber),
							  }),
					);

					if (selectRow) {
						dispatch(
							addParameterItems([
								{ parameterType: CHANNEL, parameterId: Number(channelNumber) },
							]),
						);
					}
					dispatch(setIsUnusedChannelsListFetching(false));
					dispatch(setUnusedChannelsPaginationAvailable(true));
				});
		} catch (e) {
			console.log(e);
		}
	};
export const fetchGroupsList =
	(
		pageNumber: number,
		pageRowCount: number,
		filterStr: string | null = null,
		fkChannel: number | null = null,
		serverId: number | null,
		isNeedUpdateList: boolean,
		filterMode: number,
		mode: number,
		sortOrder: SortOrderMode,
		userId?: string,
	) =>
	(dispatch: AppDispatch) => {
		try {
			dispatch(setIsGroupsListFetching(true));
			rxStompRPC
				.rpc({
					destination: rpcEndPoint,
					body: JSON.stringify(
						groupsListQuery({
							pageNumber,
							pageRowCount,
							filterStr,
							fkChannel,
							serverId,
							filterMode,
							mode,
							userId,
							sortOrder,
						}),
					),
				})
				.subscribe(function (result: IMessage) {
					const response = JSON.parse(result.body).Response;
					const data = response.Tables[0].Rows;
					const pageNumberOut = response.OutParameters[0]['@PageNumberOut'];
					const pageTotalCount = response.OutParameters[0]['@PageTotalCount'];

					dispatch(setGroupsPageTotalCount(pageTotalCount));
					dispatch(setGroupsBottomPageNumber(Number(pageNumberOut)));
					dispatch(setGroupsTopPageNumber(Number(pageNumberOut)));
					dispatch(
						isNeedUpdateList
							? updateGroupsList({ elementsList: data, toBottom: true })
							: setGroupsList({
									groupsList: data,
									groupNumber: Number(filterStr),
							  }),
					);
					const group: GroupsListItemType = data.find(
						(item: GroupsListItemType) => item.Number === Number(filterStr),
					);

					switch (filterMode) {
						case GROUP_NUMBER_FILTER_INDEX: {
							if (Number(filterStr) && !group) {
								toast.error(`Группа №${filterStr} не найдена`);
								dispatch(removeParameterItems(GROUP));
							} else {
								if (group)
									dispatch(
										addParameterItems([
											{ parameterType: GROUP, parameterId: group?.Number },
										]),
									);
							}
						}
					}

					dispatch(setIsGroupsListFetching(false));
					dispatch(setGroupsPaginationAvailable(true));
				});
		} catch (e) {
			console.log(e);
		}
	};

// Обновление групп по номеру
export const updateGroups =
	(
		fkNumber: number,
		itemType: TreeItemType,
		treeType: TreeType,
		serverId: number | null,
		userId?: string,
	) =>
	(dispatch: AppDispatch, getState: () => RootState) => {
		const { filtersReducer, sortReducer } = getState();
		const mode =
			treeType === FORWARD_TREE && itemType === GROUP
				? filtersReducer.groupsActiveFilter
				: filtersReducer.devicesActiveFilter;
		const { groupsSortOrder } = sortReducer;
		try {
			dispatch(setIsGroupsListFetching(true));
			rxStompRPC
				.rpc({
					destination: rpcEndPoint,
					body: JSON.stringify(
						groupsListQuery({
							pageNumber: 1,
							pageRowCount: COMMON_PAGE_ROW_COUNT,
							filterStr: String(fkNumber),
							fkChannel: null,
							serverId,
							filterMode: 1,
							mode,
							userId,
							sortOrder: groupsSortOrder,
						}),
					),
				})
				.subscribe(function (result: IMessage) {
					const resultData = JSON.parse(result.body).Response.Tables[0].Rows;
					dispatch(
						updateGroupsList({ elementsList: resultData, toBottom: true }),
					);
					dispatch(setIsGroupsListFetching(false));
				});
		} catch (e) {
			console.log(e);
		}
	};

// Обновление приборов по номеру
export const updateDevices =
	(
		fkNumber: number,
		itemType: TreeItemType,
		treeType: TreeType,
		serverId: number | null,
		userId?: string,
	) =>
	(dispatch: AppDispatch, getState: () => RootState) => {
		const { filtersReducer, sortReducer } = getState();

		const mode =
			treeType === REVERSE_TREE && itemType === DEVICE
				? filtersReducer.groupsActiveFilter
				: filtersReducer.devicesActiveFilter;
		const { devicesSortOrder } = sortReducer;

		try {
			rxStompRPC
				.rpc({
					destination: rpcEndPoint,
					body: JSON.stringify(
						devicesListQuery({
							pageNumber: 1,
							pageRowCount: COMMON_PAGE_ROW_COUNT,
							filterMode: 1,
							filterStr: String(fkNumber),
							serverId,
							mode,
							userId,
							sortOrder: devicesSortOrder,
						}),
					),
				})
				.subscribe(function (result: IMessage) {
					const resultData = JSON.parse(result.body).Response.Tables[0].Rows;
					dispatch(
						updateDevicesList({ elementsList: resultData, toBottom: true }),
					);
				});
		} catch (e) {
			console.log(e);
		}
	};

// Обновление списков (при раскрытии элемента) по номеру родительского элемента
export const updateElementsLists =
	(
		fkNumber: number,
		itemType: TreeItemType,
		treeType: TreeType,
		serverId: number | null,
	) =>
	(dispatch: AppDispatch, getState: () => RootState) => {
		dispatch(setChannelsInDevicesScrollAvailable(false));
		const { filtersReducer, sortReducer, authReducer, configuratorReducer } =
			getState();
		const { unusedChannelsSortOrder } = sortReducer;
		const { devicePagination } = configuratorReducer;
		const { filterString, filterMode } = devicePagination;
		const userId = authReducer.user?.preferredUsername;
		let query;
		let updateData: ActionCreatorWithPayload<any>;

		const mode =
			treeType === FORWARD_TREE
				? filtersReducer.groupsActiveFilter
				: filtersReducer.devicesActiveFilter;

		const setIsListFetching =
			treeType === FORWARD_TREE
				? setIsGroupsListFetching
				: treeType === REVERSE_TREE
				? setIsDevicesListFetching
				: setIsUnusedChannelsListFetching;

		dispatch(setIsListFetching(true));
		switch (itemType) {
			case CHANNEL: {
				if (treeType === REVERSE_TREE || treeType === UNUSED_CHANNELS_TREE) {
					query = groupsListQuery({
						pageNumber: 1,
						pageRowCount: COMMON_PAGE_ROW_COUNT,
						filterStr: null,
						fkChannel: fkNumber,
						serverId,
						filterMode: 1,
						mode,
						userId,
						sortOrder:
							treeType === UNUSED_CHANNELS_TREE
								? unusedChannelsSortOrder
								: SortOrderMode.NUMBER_FORWARD,
					});
					updateData = updateGroupsListChildren;
				} else if (treeType === FORWARD_TREE) {
					query = devicesListQuery({
						pageNumber: 1,
						pageRowCount: COMMON_PAGE_ROW_COUNT,
						filterMode: 3,
						filterStr: String(fkNumber),
						serverId,
						mode,
						userId,
						sortOrder: SortOrderMode.NUMBER_FORWARD,
					});
					updateData = updateDevicesListChildren;
				}
				break;
			}
			case GROUP: {
				query = channelsListQuery({
					pageNumber: 1,
					pageRowCount: 0,
					mode: 1,
					serverId,
					fkGroup: fkNumber,
					userId,
					sortOrder: SortOrderMode.NUMBER_FORWARD,
				});
				updateData = updateChannelsList;
				break;
			}
			case DEVICE: {
				query = channelsListQuery({
					pageNumber: 1,
					pageRowCount: 0,
					mode: 1,
					serverId,
					fkDevice: fkNumber,
					userId,
					sortOrder: SortOrderMode.NUMBER_FORWARD,
				});
				updateData = updateChannelsList;
				break;
			}
		}

		try {
			rxStompRPC
				.rpc({
					destination: rpcEndPoint,
					body: JSON.stringify(query),
				})
				.subscribe(function (result: IMessage) {
					const resultData = JSON.parse(result.body).Response.Tables[0].Rows;
					dispatch(updateData(resultData));
					dispatch(setIsListFetching(false));
					if (
						treeType === REVERSE_TREE &&
						filterMode === 3 &&
						Number.isInteger(parseInt(String(filterString)))
					) {
						dispatch(setChannelsInDevicesScrollAvailable(true));
					}
				});
		} catch (e) {
			console.log(e);
		}
	};

// Добавление элементов к спискам при пагинации
export const addElementsLists =
	(
		itemType: TreeItemType,
		treeType: TreeType,
		serverId: number | null,
		toBottom: boolean,
	) =>
	(dispatch: AppDispatch, getState: () => RootState) => {
		const { filtersReducer, sortReducer, authReducer, configuratorReducer } =
			getState();
		const {
			isGroupsListFetching,
			isDevicesListFetching,
			isUnusedChannelsListFetching,
		} = configuratorReducer;
		const userId = authReducer.user?.preferredUsername;
		const isListFetching =
			treeType === FORWARD_TREE
				? isGroupsListFetching
				: treeType === REVERSE_TREE
				? isDevicesListFetching
				: isUnusedChannelsListFetching;
		if (isListFetching) return;

		const setIsListFetching =
			treeType === FORWARD_TREE
				? setIsGroupsListFetching
				: treeType === REVERSE_TREE
				? setIsDevicesListFetching
				: setIsUnusedChannelsListFetching;

		const {
			topPageNumber,
			bottomPageNumber,
			pageRowCount,
			filterMode,
			filterString,
		} =
			configuratorReducer[
				treeType === FORWARD_TREE
					? 'groupPagination'
					: treeType === REVERSE_TREE
					? 'devicePagination'
					: 'unusedChannelsPagination'
			];

		const mode =
			treeType === FORWARD_TREE
				? filtersReducer.groupsActiveFilter
				: treeType === REVERSE_TREE
				? filtersReducer.devicesActiveFilter
				: 1;

		const { groupsSortOrder, devicesSortOrder, unusedChannelsSortOrder } =
			sortReducer;

		let query;
		let updateData: ActionCreatorWithPayload<any>;
		let stopRequest = false;

		const resultFilterString = () => {
			if (Number(filterString)) {
				if (filterMode === 4) return filterString;
				return null;
			} else return filterString;
		};
		const setNeedToScroll =
			treeType === FORWARD_TREE
				? setNeedToScrollGroups
				: treeType === REVERSE_TREE
				? setNeedToScrollDevices
				: setNeedToScrollUnusedChannels;

		if (itemType === SERVER) {
			switch (treeType) {
				case FORWARD_TREE: {
					if (toBottom)
						dispatch(setGroupsBottomPageNumber(bottomPageNumber + 1));
					else if (topPageNumber > 2)
						dispatch(setGroupsTopPageNumber(topPageNumber - 1));
					else stopRequest = true;
					query = groupsListQuery({
						pageNumber: toBottom ? bottomPageNumber + 1 : topPageNumber - 1,
						pageRowCount,
						filterStr: resultFilterString(),
						fkChannel: null,
						serverId,
						filterMode,
						mode,
						userId,
						sortOrder: groupsSortOrder,
					});
					updateData = updateGroupsList;
					break;
				}

				case REVERSE_TREE: {
					if (toBottom)
						dispatch(setDevicesBottomPageNumber(bottomPageNumber + 1));
					else if (topPageNumber > 2)
						dispatch(setDevicesTopPageNumber(topPageNumber - 1));
					else stopRequest = true;

					query = devicesListQuery({
						pageNumber: toBottom ? bottomPageNumber + 1 : topPageNumber - 1,
						pageRowCount,
						filterMode,
						filterStr: resultFilterString(),
						serverId,
						mode,
						userId,
						sortOrder: devicesSortOrder,
					});
					updateData = updateDevicesList;
					break;
				}

				case UNUSED_CHANNELS_TREE: {
					if (toBottom)
						dispatch(setUnusedChannelsBottomPageNumber(bottomPageNumber + 1));
					else if (topPageNumber > 2)
						dispatch(setUnusedChannelsTopPageNumber(topPageNumber - 1));
					else stopRequest = true;

					query = channelsListQuery({
						pageNumber: toBottom ? bottomPageNumber + 1 : topPageNumber - 1,
						pageRowCount,
						mode: 3,
						serverId,
						userId,
						sortOrder: unusedChannelsSortOrder,
					});
					updateData = updateUnusedChannelsList;
					break;
				}
			}
		}
		try {
			if (!isListFetching && !stopRequest) {
				dispatch(setIsListFetching(true));
				rxStompRPC
					.rpc({
						destination: rpcEndPoint,
						body: JSON.stringify(query),
					})
					.subscribe(function (result: IMessage) {
						const resultData = JSON.parse(result.body).Response.Tables[0].Rows;
						dispatch(
							updateData({ elementsList: resultData, toBottom: toBottom }),
						);
						dispatch(setIsListFetching(false));
					});
				if (!toBottom && topPageNumber !== 1) {
					dispatch(setNeedToScroll(true));
				}
			}
		} catch (e) {
			console.log(e);
		}
	};
