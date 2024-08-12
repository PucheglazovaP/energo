import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import { COMMON_PAGE_ROW_COUNT } from '../../../Const';
import {
	ChannelsListActionPayloadType,
	ChannelsListItemType,
	DevicesListItemType,
	GroupsListItemType,
	ServersListItemType,
} from '../../../Types';
import {
	ConfiguratorPagination,
	TreeItemsToOpen,
} from '../../../Types/ConfiguratorTypes';
import { FavouriteLogOperationType } from '../../../Types/RpcResponseTypes';
import { RemoveChannelsFromGroup } from '../ContextMenuSlice/Channel/queries/types';

import { UpdateElements } from './types';

export interface ConfiguratorState {
	currentServer: number | null;
	isGroupsListFetching: boolean;
	isDevicesListFetching: boolean;
	isUnusedChannelsListFetching: boolean;
	serversList: ServersListItemType[];
	groupsList: GroupsListItemType[];
	groupsListChildren: GroupsListItemType[];
	channelsList: ChannelsListItemType[];
	unusedChannelsList: ChannelsListItemType[];
	devicesList: DevicesListItemType[];
	devicesListChildren: DevicesListItemType[];
	groupPagination: ConfiguratorPagination;
	devicePagination: ConfiguratorPagination;
	unusedChannelsPagination: ConfiguratorPagination;
	treeItemsToOpen: TreeItemsToOpen[];
}

const initialState: ConfiguratorState = {
	currentServer: null,
	isGroupsListFetching: false,
	isDevicesListFetching: false,
	isUnusedChannelsListFetching: false,
	serversList: [],
	groupsList: [],
	groupsListChildren: [],
	channelsList: [],
	unusedChannelsList: [],
	devicesList: [],
	devicesListChildren: [],
	treeItemsToOpen: [],
	groupPagination: {
		pageTotalCount: 1000,
		pageRowCount: COMMON_PAGE_ROW_COUNT,
		topPageNumber: 1,
		bottomPageNumber: 1,
		isFirstFetching: true,
		paginationAvailable: true,
		filterMode: 1,
		filterString: '',
		needToScroll: false,
		scrollbarPosition: null,
	},
	devicePagination: {
		pageTotalCount: 1000,
		pageRowCount: COMMON_PAGE_ROW_COUNT,
		topPageNumber: 1,
		bottomPageNumber: 1,
		isFirstFetching: true,
		paginationAvailable: true,
		filterMode: 1,
		filterString: '',
		needToScroll: false,
		scrollbarPosition: null,
		scrollChannelsAvailable: false,
	},
	unusedChannelsPagination: {
		pageTotalCount: 1000,
		pageRowCount: COMMON_PAGE_ROW_COUNT,
		topPageNumber: 1,
		bottomPageNumber: 1,
		isFirstFetching: true,
		paginationAvailable: true,
		filterMode: 1,
		filterString: '',
		needToScroll: false,
		scrollbarPosition: null,
	},
};

export const configuratorSlice = createSlice({
	name: 'configurator',
	initialState,
	reducers: {
		setCurrentServer: (state, action: PayloadAction<number | null>) => {
			state.currentServer = action.payload;
		},
		addTreeItemsToOpen: (state, action: PayloadAction<TreeItemsToOpen[]>) => {
			state.treeItemsToOpen = state.treeItemsToOpen.concat(action.payload);
		},
		removeTreeItemsToOpen: (
			state,
			action: PayloadAction<TreeItemsToOpen[]>,
		) => {
			const set = new Set(action.payload.map((e) => JSON.stringify(e)));
			state.treeItemsToOpen = state.treeItemsToOpen.filter(
				(e) => !set.has(JSON.stringify(e)),
			);
		},
		setChannelsInDevicesScrollAvailable: (
			state,
			action: PayloadAction<boolean>,
		) => {
			state.devicePagination.scrollChannelsAvailable = action.payload;
		},
		setScrollbarPositionGroups: (
			state,
			action: PayloadAction<number | null>,
		) => {
			if (!action.payload) {
				state.groupPagination.scrollbarPosition = action.payload;
				return;
			}
			const index = state.groupsList.findIndex(
				(groupItem) => groupItem.Number === action.payload,
			);
			state.groupPagination.scrollbarPosition = 1 + 37 * index;
		},
		setScrollbarPositionDevices: (
			state,
			action: PayloadAction<number | null>,
		) => {
			if (!action.payload) {
				state.devicePagination.scrollbarPosition = action.payload;
				return;
			}

			const index = state.devicesList.findIndex(
				(deviceItem) => deviceItem.Number === action.payload,
			);
			state.devicePagination.scrollbarPosition = 1 + 37 * index;
		},
		setScrollbarPositionChannelsInDevices: (
			state,
			action: PayloadAction<number | null>,
		) => {
			const channelNumber = action.payload;
			if (!channelNumber) {
				state.devicePagination.scrollbarPosition = channelNumber;
				return;
			}

			const deviceNumber = state.channelsList.find(
				(channelItem) => channelItem.Number === channelNumber,
			)?.FK_Devices;

			const channelsList: ChannelsListItemType[] = state.channelsList.filter(
				(channelItem) => channelItem.FK_Devices === deviceNumber,
			);

			let channelIndex: number = 0;
			for (const channel of channelsList) {
				if (channel.Number === channelNumber) break;
				channelIndex = channelIndex + 1;
			}
			state.devicePagination.scrollbarPosition = 1 + 37 * channelIndex;
		},

		setScrollbarPositionUnusedChannels: (
			state,
			action: PayloadAction<number | null>,
		) => {
			if (!action.payload) {
				state.unusedChannelsPagination.scrollbarPosition = action.payload;
				return;
			}

			const index = state.unusedChannelsList.findIndex(
				(channelItem) => channelItem.Number === action.payload,
			);
			state.unusedChannelsPagination.scrollbarPosition = 1 + 37 * index;
		},

		setNeedToScrollGroups: (state, action: PayloadAction<boolean>) => {
			state.groupPagination.needToScroll = action.payload;
		},
		setNeedToScrollDevices: (state, action: PayloadAction<boolean>) => {
			state.devicePagination.needToScroll = action.payload;
		},
		setNeedToScrollUnusedChannels: (state, action: PayloadAction<boolean>) => {
			state.unusedChannelsPagination.needToScroll = action.payload;
		},
		setGroupsPagination: (
			state,
			action: PayloadAction<ConfiguratorPagination>,
		) => {
			state.groupPagination = {
				...state.groupPagination,
				...action.payload,
			};
		},
		setDevicesPagination: (
			state,
			action: PayloadAction<ConfiguratorPagination>,
		) => {
			state.groupPagination = {
				...state.devicePagination,
				...action.payload,
			};
		},
		setGroupsFilterString: (state, action: PayloadAction<string | null>) => {
			state.groupPagination.filterString = action.payload;
		},
		setGroupsFilterMode: (state, action: PayloadAction<number>) => {
			state.groupPagination.filterMode = action.payload;
		},
		setDevicesFilterString: (state, action: PayloadAction<string | null>) => {
			state.devicePagination.filterString = action.payload;
		},
		setDevicesFilterMode: (state, action: PayloadAction<number>) => {
			state.devicePagination.filterMode = action.payload;
		},

		setGroupsPaginationAvailable: (state, action: PayloadAction<boolean>) => {
			state.groupPagination.paginationAvailable = action.payload;
		},
		setDevicesPaginationAvailable: (state, action: PayloadAction<boolean>) => {
			state.devicePagination.paginationAvailable = action.payload;
		},
		setUnusedChannelsPaginationAvailable: (
			state,
			action: PayloadAction<boolean>,
		) => {
			state.unusedChannelsPagination.paginationAvailable = action.payload;
		},
		setGroupsPageTotalCount: (state, action: PayloadAction<number>) => {
			state.groupPagination.pageTotalCount = action.payload;
		},
		setDevicesPageTotalCount: (state, action: PayloadAction<number>) => {
			state.devicePagination.pageTotalCount = action.payload;
		},
		setUnusedChannelsPageTotalCount: (state, action: PayloadAction<number>) => {
			state.unusedChannelsPagination.pageTotalCount = action.payload;
		},
		setIsGroupsListFetching: (state, action: PayloadAction<boolean>) => {
			state.isGroupsListFetching = action.payload;
		},
		setIsDevicesListFetching: (state, action: PayloadAction<boolean>) => {
			state.isDevicesListFetching = action.payload;
		},
		setIsUnusedChannelsListFetching: (
			state,
			action: PayloadAction<boolean>,
		) => {
			state.isUnusedChannelsListFetching = action.payload;
		},
		setDevicesPageRowCount: (state, action: PayloadAction<number>) => {
			state.devicePagination.pageRowCount = action.payload;
		},
		setDevicesTopPageNumber: (state, action: PayloadAction<number>) => {
			state.devicePagination.topPageNumber = action.payload;
		},
		setDevicesBottomPageNumber: (state, action: PayloadAction<number>) => {
			state.devicePagination.bottomPageNumber = action.payload;
		},
		setUnusedChannelsTopPageNumber: (state, action: PayloadAction<number>) => {
			state.unusedChannelsPagination.topPageNumber = action.payload;
		},
		setUnusedChannelsBottomPageNumber: (
			state,
			action: PayloadAction<number>,
		) => {
			state.unusedChannelsPagination.bottomPageNumber = action.payload;
		},
		setDevicesFirstFetching: (state, action: PayloadAction<boolean>) => {
			state.devicePagination.isFirstFetching = action.payload;
		},
		setGroupsPageRowCount: (state, action: PayloadAction<number>) => {
			state.groupPagination.pageRowCount = action.payload;
		},
		setGroupsTopPageNumber: (state, action: PayloadAction<number>) => {
			state.groupPagination.topPageNumber = action.payload;
		},
		setGroupsBottomPageNumber: (state, action: PayloadAction<number>) => {
			state.groupPagination.bottomPageNumber = action.payload;
		},
		setGroupsFirstFetching: (state, action: PayloadAction<boolean>) => {
			state.groupPagination.isFirstFetching = action.payload;
		},
		setUnusedChannelsFirstFetching: (state, action: PayloadAction<boolean>) => {
			state.unusedChannelsPagination.isFirstFetching = action.payload;
		},

		setServersList: (state, action: PayloadAction<ServersListItemType[]>) => {
			state.serversList = state.serversList.concat(action.payload);
		},
		setGroupsList: (
			state,
			action: PayloadAction<{
				groupsList: GroupsListItemType[];
				groupNumber: number | null;
			}>,
		) => {
			const { groupNumber, groupsList } = action.payload;
			state.groupsList = groupsList;

			if (!groupNumber) {
				state.groupPagination.scrollbarPosition = groupNumber;
				return;
			}
			const index = state.groupsList.findIndex(
				(groupItem) => groupItem.Number === groupNumber,
			);
			state.groupPagination.scrollbarPosition = 1 + 37 * index;
		},

		setChannelsList: (
			state,
			action: PayloadAction<ChannelsListActionPayloadType[]>,
		) => {
			action.payload.forEach(
				(newChannelItem: ChannelsListActionPayloadType) => {
					state.channelsList.push({
						...newChannelItem,
						GroupsList: newChannelItem.GroupsList
							? newChannelItem.GroupsList.split(',').map(Number)
							: [],
						KoefList: newChannelItem.KoefList
							? newChannelItem.KoefList.split(',')
							: [],
					});
				},
			);
		},
		setUnusedChannelsList: (
			state,
			action: PayloadAction<{
				unusedChannelsList: ChannelsListActionPayloadType[];
				channelNumber: number | null;
			}>,
		) => {
			const { unusedChannelsList, channelNumber } = action.payload;
			state.unusedChannelsList = [];
			unusedChannelsList.forEach(
				(newChannelItem: ChannelsListActionPayloadType) => {
					state.unusedChannelsList.push({
						...newChannelItem,
						GroupsList: newChannelItem.GroupsList
							? newChannelItem.GroupsList.split(',').map(Number)
							: [],
						KoefList: newChannelItem.KoefList
							? newChannelItem.KoefList.split(',')
							: [],
					});
				},
			);
			if (!channelNumber) {
				state.unusedChannelsPagination.scrollbarPosition = channelNumber;
				return;
			}
			const index = state.unusedChannelsList.findIndex(
				(channelItem) => channelItem.Number === channelNumber,
			);
			state.unusedChannelsPagination.scrollbarPosition = 1 + 37 * index;
		},

		setDevicesList: (
			state,
			action: PayloadAction<{
				devicesList: DevicesListItemType[];
				deviceNumber: number | null;
			}>,
		) => {
			const { deviceNumber, devicesList } = action.payload;
			state.devicesList = devicesList;
			if (!deviceNumber) {
				state.devicePagination.scrollbarPosition = deviceNumber;
				return;
			}
			const index = state.devicesList.findIndex(
				(deviceItem) => deviceItem.Number === deviceNumber,
			);
			state.devicePagination.scrollbarPosition = 1 + 37 * index;
		},

		updateGroupsList: (state, action: PayloadAction<UpdateElements>) => {
			const { elementsList, toBottom } = action.payload;
			let elementsListToTop: GroupsListItemType[] = [];
			(elementsList as GroupsListItemType[]).forEach((newGroupItem) => {
				const elemIndex = state.groupsList.findIndex(
					(groupItem) => groupItem.Number === newGroupItem.Number,
				);
				if (elemIndex === -1) {
					if (toBottom) {
						state.groupsList.push(newGroupItem);
					} else {
						elementsListToTop.push(newGroupItem);
					}
				} else {
					state.groupsList[elemIndex] = newGroupItem;
				}
			});
			if (!toBottom)
				state.groupsList = elementsListToTop.concat(state.groupsList);
		},

		updateGroupsListChildren: (
			state,
			action: PayloadAction<GroupsListItemType[]>,
		) => {
			action.payload.forEach((newGroupItem) => {
				const elemIndex = state.groupsListChildren.findIndex(
					(groupItem) => groupItem.Number === newGroupItem.Number,
				);
				if (elemIndex === -1) {
					state.groupsListChildren.push(newGroupItem);
				} else {
					state.groupsListChildren[elemIndex] = newGroupItem;
				}
			});
		},

		updateDevicesList: (state, action: PayloadAction<UpdateElements>) => {
			const { elementsList, toBottom } = action.payload;
			let elementsListToTop: DevicesListItemType[] = [];
			(elementsList as DevicesListItemType[]).forEach((newDeviceItem) => {
				const elemIndex = state.devicesList.findIndex(
					(deviceItem) => deviceItem.Number === newDeviceItem.Number,
				);
				if (elemIndex === -1) {
					if (toBottom) {
						state.devicesList.push(newDeviceItem);
					} else {
						elementsListToTop.push(newDeviceItem);
					}
				} else {
					state.devicesList[elemIndex] = newDeviceItem;
				}
			});
			if (!toBottom)
				state.devicesList = elementsListToTop.concat(state.devicesList);
		},

		updateDevicesListChildren: (
			state,
			action: PayloadAction<DevicesListItemType[]>,
		) => {
			action.payload.forEach((newDeviceItem) => {
				const elemIndex = state.devicesListChildren.findIndex(
					(deviceItem) => deviceItem.Number === newDeviceItem.Number,
				);
				if (elemIndex === -1) {
					state.devicesListChildren.push(newDeviceItem);
				} else {
					state.devicesListChildren[elemIndex] = newDeviceItem;
				}
			});
		},

		updateChannelsList: (
			state,
			action: PayloadAction<ChannelsListActionPayloadType[]>,
		) => {
			action.payload.forEach(
				(newChannelItem: ChannelsListActionPayloadType) => {
					const elemIndex = state.channelsList.findIndex(
						(channelItem) => channelItem.Number === newChannelItem.Number,
					);
					const newItemData = {
						...newChannelItem,
						GroupsList: newChannelItem.GroupsList
							? newChannelItem.GroupsList.split(',').map(Number)
							: [],
						KoefList: newChannelItem.KoefList
							? newChannelItem.KoefList.split(',')
							: [],
					};
					if (elemIndex === -1) {
						state.channelsList.push(newItemData);
					} else {
						state.channelsList[elemIndex] = newItemData;
					}
				},
			);
		},

		removeChannelsFromGroup: (
			state,
			action: PayloadAction<{ groupNumber: number }>,
		) => {
			const { groupNumber } = action.payload;

			state.channelsList.forEach((channel, channelIndex) => {
				channel.GroupsList.forEach((channelGroup, channelGroupIndex) => {
					if (channelGroup === groupNumber) {
						state.channelsList[channelIndex].GroupsList.splice(
							channelGroupIndex,
							1,
						);
						state.channelsList[channelIndex].KoefList.splice(
							channelGroupIndex,
							1,
						);
					}
				});
			});
		},

		updateUnusedChannelsList: (
			state,
			action: PayloadAction<UpdateElements>,
		) => {
			const { elementsList, toBottom } = action.payload;
			let elementsListToTop: ChannelsListItemType[] = [];

			(elementsList as ChannelsListActionPayloadType[]).forEach(
				(newChannelItem: ChannelsListActionPayloadType) => {
					const elemIndex = state.unusedChannelsList.findIndex(
						(channelItem) => channelItem.Number === newChannelItem.Number,
					);
					const newItemData = {
						...newChannelItem,
						GroupsList: newChannelItem.GroupsList
							? newChannelItem.GroupsList.split(',').map(Number)
							: [],
						KoefList: newChannelItem.KoefList
							? newChannelItem.KoefList.split(',')
							: [],
					};
					if (elemIndex === -1) {
						if (toBottom) {
							state.unusedChannelsList.push(newItemData);
						} else {
							elementsListToTop.push(newItemData);
						}
					} else {
						state.unusedChannelsList[elemIndex] = newItemData;
					}
				},
			);
			if (!toBottom)
				state.unusedChannelsList = elementsListToTop.concat(
					state.unusedChannelsList,
				);
		},

		updateGroupFavourite: (
			state,
			action: PayloadAction<{
				logOperation: FavouriteLogOperationType;
				isFavourite: boolean;
			}>,
		) => {
			const { isFavourite, logOperation } = action.payload;
			const groupData = logOperation.info[0];
			let groupItemIndex = state.groupsList.findIndex(
				(groupItem) => groupItem.Number === groupData.Number,
			);
			if (groupItemIndex >= 0) {
				state.groupsList[groupItemIndex].LastModified = groupData.LastModified;
				state.groupsList[groupItemIndex].isFavorite = isFavourite;
			}
		},
		updateDeviceFavourite: (
			state,
			action: PayloadAction<{
				logOperation: FavouriteLogOperationType;
				isFavourite: boolean;
			}>,
		) => {
			const { isFavourite, logOperation } = action.payload;
			const deviceData = logOperation.info[0];
			let deviceItemIndex = state.devicesList.findIndex(
				(deviceItem) => deviceItem.Number === deviceData.Number,
			);
			if (deviceItemIndex >= 0) {
				state.devicesList[deviceItemIndex].LastModified =
					deviceData.LastModified;
				state.devicesList[deviceItemIndex].isFavorite = isFavourite;
			}
		},
		filterGroupsList: (state, action: PayloadAction<number>) => {
			const groupToRemoveIndex = state.groupsList.findIndex(
				(groupItem) => groupItem.Number === action.payload,
			);
			state.groupsList.splice(groupToRemoveIndex, 1);
		},
		filterDevicesList: (state, action: PayloadAction<number>) => {
			const deviceToRemoveIndex = state.devicesList.findIndex(
				(deviceItem) => deviceItem.Number === action.payload,
			);
			state.devicesList.splice(deviceToRemoveIndex, 1);
		},
		filterChannelsList: (state, action: PayloadAction<number>) => {
			const channelToRemoveIndex = state.channelsList.findIndex(
				(channelItem) => channelItem.Number === action.payload,
			);
			state.channelsList.splice(channelToRemoveIndex, 1);
		},
		filterUnusedChannelsList: (state, action: PayloadAction<number>) => {
			const channelToRemoveIndex = state.unusedChannelsList.findIndex(
				(channelItem) => channelItem.Number === action.payload,
			);
			state.unusedChannelsList.splice(channelToRemoveIndex, 1);
		},
		deleteChannelFromGroup: (
			state,
			action: PayloadAction<RemoveChannelsFromGroup>,
		) => {
			const { groupNumber, channelNumber } = action.payload;
			const channelToRemoveIndex = state.channelsList.findIndex(
				(channelItem) => channelItem.Number === channelNumber,
			);
			const indexToRemove = state.channelsList[
				channelToRemoveIndex
			]?.GroupsList?.findIndex((item) => item === groupNumber);

			state.channelsList[channelToRemoveIndex].GroupsList = state.channelsList[
				channelToRemoveIndex
			]?.GroupsList?.filter((_item, index) => index !== indexToRemove);

			state.channelsList[channelToRemoveIndex].KoefList = state.channelsList[
				channelToRemoveIndex
			]?.KoefList?.filter((_item, index) => index !== indexToRemove);
		},
	},
});

// Action creators are generated for each case reducer function
export const {
	setGroupsList,
	setServersList,
	setChannelsList,
	setDevicesList,
	updateGroupsList,
	updateDevicesList,
	updateChannelsList,
	removeChannelsFromGroup,
	setGroupsPageRowCount,
	setGroupsBottomPageNumber,
	setGroupsTopPageNumber,
	setDevicesBottomPageNumber,
	setDevicesTopPageNumber,
	setUnusedChannelsTopPageNumber,
	setUnusedChannelsBottomPageNumber,
	setGroupsFirstFetching,
	setUnusedChannelsFirstFetching,
	setDevicesFirstFetching,
	setDevicesPageRowCount,
	setIsGroupsListFetching,
	setIsDevicesListFetching,
	setIsUnusedChannelsListFetching,
	setDevicesPageTotalCount,
	setGroupsPageTotalCount,
	setUnusedChannelsPageTotalCount,
	setGroupsPaginationAvailable,
	setDevicesPaginationAvailable,
	setUnusedChannelsPaginationAvailable,
	setGroupsPagination,
	setNeedToScrollGroups,
	setNeedToScrollDevices,
	setNeedToScrollUnusedChannels,
	setGroupsFilterString,
	setGroupsFilterMode,
	setDevicesFilterMode,
	setDevicesFilterString,
	setUnusedChannelsList,
	setScrollbarPositionGroups,
	setScrollbarPositionDevices,
	setScrollbarPositionUnusedChannels,
	setCurrentServer,
	updateGroupFavourite,
	updateDeviceFavourite,
	filterGroupsList,
	filterDevicesList,
	filterChannelsList,
	filterUnusedChannelsList,
	deleteChannelFromGroup,
	updateUnusedChannelsList,
	updateGroupsListChildren,
	updateDevicesListChildren,
	removeTreeItemsToOpen,
	addTreeItemsToOpen,
	setScrollbarPositionChannelsInDevices,
	setChannelsInDevicesScrollAvailable,
} = configuratorSlice.actions;

export default configuratorSlice.reducer;
