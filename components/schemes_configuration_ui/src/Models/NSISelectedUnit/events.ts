import { createEvent } from 'effector';

import { TabName } from '../../Containers/NSIInformationPanel/types';
import { TreeItem } from '../../UI/Tree/types';

import { NSISelectedUnit } from './types';

export const setSelectedUnit = createEvent<NSISelectedUnit | null>(
	'Set NSI selected unit',
);
export const setSelectedNode = createEvent<TreeItem | null>(
	'Set NSI selected tree node',
);
export const setCurrentParentNode = createEvent<TreeItem | null>(
	'Set node of selected nsi channel/equipment piece',
);
export const setCurrentParentChannelId = createEvent<number | null>(
	'Set channel id of selected equipment piece',
);
export const setParentChannel = createEvent<TreeItem | null>(
	'Set channel to which selected equipment piece is linked to',
);
export const setAvailableNodes = createEvent<TreeItem[]>(
	'Set list of available nodes for channels to be moved to',
);
export const setAvailableChannels = createEvent<TreeItem[]>(
	'Set list of available channels for equipment pieces to be moved to',
);
export const setItemsToMove = createEvent<TreeItem[]>(
	'Set list of channels / equipment pieces to be moved to other node',
);
export const setNsiSelectedTab = createEvent<TabName>(
	'Set selected tab of NSI information panel',
);
