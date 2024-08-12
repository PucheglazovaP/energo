import { createStore } from 'effector';

import { TabName } from '../../Containers/NSIInformationPanel/types';
import { TreeItem } from '../../UI/Tree/types';

import {
	setAvailableChannels,
	setAvailableNodes,
	setCurrentParentChannelId,
	setCurrentParentNode,
	setItemsToMove,
	setNsiSelectedTab,
	setParentChannel,
	setSelectedNode,
	setSelectedUnit,
} from './events';
import { NSISelectedUnit } from './types';

export const $nsiSelectedUnit = createStore<NSISelectedUnit | null>(null).on(
	setSelectedUnit,
	(state, selectedUnit) => {
		return selectedUnit;
	},
);

export const $nsiSelectedNode = createStore<TreeItem | null>(null).on(
	setSelectedNode,
	(state, selectedNode: TreeItem | null) => {
		return selectedNode;
	},
);

export const $nsiAvailableNodes = createStore<TreeItem[]>([]).on(
	setAvailableNodes,
	(state, availableNodes: TreeItem[]) => availableNodes,
);
export const $nsiAvailableChannels = createStore<TreeItem[]>([]).on(
	setAvailableChannels,
	(state, availableChannels: TreeItem[]) => availableChannels,
);
export const $nsiItemsToMove = createStore<TreeItem[]>([]).on(
	setItemsToMove,
	(state, channelsToMove: TreeItem[]) => channelsToMove,
);
export const $nsiCurrentParentNode = createStore<TreeItem | null>(null).on(
	setCurrentParentNode,
	(state, nodeId: TreeItem | null) => nodeId,
);
export const $nsiCurrentParentChannelId = createStore<number | null>(null).on(
	setCurrentParentChannelId,
	(state, nodeId: number | null) => nodeId,
);
export const $nsiParentChannel = createStore<TreeItem | null>(null).on(
	setParentChannel,
	(state, channel: TreeItem | null) => channel,
);

export const $nsiSelectedTab = createStore<TabName>(TabName.USER_SETTINGS).on(
	setNsiSelectedTab,
	(_state, selectedTab: TabName) => selectedTab,
);
