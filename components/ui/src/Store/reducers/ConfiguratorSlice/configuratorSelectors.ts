import { DEVICE, GROUP } from '../../../Const';
import { getElementTypeByMenuType } from '../../../Containers/History/utils';
import { UNUSED_CHANNEL_CONTEXT_MENU } from '../../../Types/ContextMenuTypes';
import { RootState } from '../../store';
import { HistoryElementType } from '../HistorySlice/types';

import { getTreeItemTypeByMenuType } from './utils';

/**
 * Return the element chosen in the context menu (device/channel/group)
 */
export const selectEnergyElement = (state: RootState) => {
	const { configuratorReducer: configurator, contextMenuReducer: contextMenu } =
		state;
	const { id, type } = contextMenu;
	const { groupsList, channelsList, unusedChannelsList, devicesList } =
		configurator;
	const elementType = getElementTypeByMenuType(type);
	switch (elementType) {
		case HistoryElementType.DEVICE:
			return devicesList.find((device) => device.Number === id);
		case HistoryElementType.GROUP:
			return groupsList.find((group) => group.Number === id);
		default:
			if (type === UNUSED_CHANNEL_CONTEXT_MENU) {
				return unusedChannelsList.find((channel) => channel.Number === id);
			}
			return channelsList.find((channel) => channel.Number === id);
	}
};
export const selectConfiguratorPagination = (state: RootState) => {
	const { groupPagination, devicePagination, unusedChannelsPagination } =
		state.configuratorReducer;
	return { groupPagination, devicePagination, unusedChannelsPagination };
};

/**
 * Return the TreeItem element chosen in the context menu (device/channel/group)
 */
export const selectTreeItemFromContextMenu = (state: RootState) => {
	const { configuratorReducer: configurator, contextMenuReducer: contextMenu } =
		state;
	const { id, type } = contextMenu;
	const { groupsList, devicesList, channelsList, unusedChannelsList } =
		configurator;
	const elementType = getTreeItemTypeByMenuType(type);
	switch (elementType) {
		case DEVICE:
			return devicesList.find((device) => device.Number === id);
		case GROUP:
			return groupsList.find((group) => group.Number === id);
		default:
			if (type === UNUSED_CHANNEL_CONTEXT_MENU) {
				return unusedChannelsList.find((channel) => channel.Number === id);
			}
			return channelsList.find((channel) => channel.Number === id);
	}
};

export const selectCurrentServer = (state: RootState) => {
	return state.configuratorReducer.currentServer;
};
export const selectPaginations = (state: RootState) => {
	const { groupPagination, devicePagination, unusedChannelsPagination } =
		state.configuratorReducer;
	return { groupPagination, devicePagination, unusedChannelsPagination };
};
