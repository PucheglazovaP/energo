import { combine } from 'effector';

import { convertUnconnectedChannelsToTree } from '../../Adapters/Tree/channels';
import { convertServersToTree } from '../../Adapters/Tree/servers';
import { $channels } from '../Channels';
import { $servers } from '../Servers';

export const $treeChannels = combine(
	$servers,
	$channels,
	(serversModel, channelsModel) => {
		const { list: serversList } = serversModel;
		const { list: channelsList } = channelsModel;
		const treeServers = convertServersToTree(serversList);
		const treeChannels = convertUnconnectedChannelsToTree(channelsList);
		return [...treeServers, ...treeChannels];
	},
);
