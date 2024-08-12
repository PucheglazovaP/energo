import { createStore } from 'effector';

import { setTreeModal } from './events';
import { TreeModal } from './types';

const initState: TreeModal = {
	deviceId: undefined,
	serverId: undefined,
	channelId: undefined,
};

export const $treeModal = createStore<TreeModal>(initState);

$treeModal.on(setTreeModal, (state, payload) => ({ ...state, ...payload }));
