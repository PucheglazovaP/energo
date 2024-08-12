import { combine } from 'effector';

import { convertChannelsToTree } from '../../Adapters/Tree/channels';
import { convertDevicesToTree } from '../../Adapters/Tree/devices';
import { convertServersToTree } from '../../Adapters/Tree/servers';
import { $channels } from '../Channels';
import { $devices } from '../Devices';
import { $servers } from '../Servers';

export const $treeDevices = combine(
	$servers,
	$devices,
	$channels,
	(serversModel, devicesModel, channelsModel) => {
		const { list: serversList } = serversModel;
		const { list: devicesList } = devicesModel;
		const { list: channelsList } = channelsModel;
		const treeServers = convertServersToTree(serversList);
		const treeDevices = convertDevicesToTree(devicesList);
		const treeChannels = convertChannelsToTree(channelsList);
		return [...treeServers, ...treeDevices, ...treeChannels];
	},
);
