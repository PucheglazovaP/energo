import { combine } from 'effector';

import { convertUnconnectedChannelsToTreeModal } from '../../Adapters/Tree/channelsModal';
import { convertServersToTree } from '../../Adapters/Tree/servers';
import { $channels } from '../Channels';
import { $servers } from '../Servers';
import { $treeModal } from '../TreeModal';

export const $treeChannelsModal = combine(
	$servers,
	$channels,
	$treeModal,
	(serversModel, channelsModel, treeModal) => {
		const { list: serversList } = serversModel;
		const { list: channelsList } = channelsModel;
		const treeServers = convertServersToTree(serversList);
		const treeChannels = convertUnconnectedChannelsToTreeModal(
			channelsList,
			treeModal,
		);
		return [...treeServers, ...treeChannels];
	},
);
