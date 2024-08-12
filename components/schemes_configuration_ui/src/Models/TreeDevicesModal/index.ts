import { combine } from 'effector';

import { convertChannelsToTree } from '../../Adapters/Tree/channels';
import { convertChannelsToTreeModal } from '../../Adapters/Tree/channelsModal';
import {
	convertDevicesToTree,
	convertPickableDevicesToTree,
} from '../../Adapters/Tree/devices';
import { convertServersToTree } from '../../Adapters/Tree/servers';
import { $channels } from '../Channels';
import { $devices } from '../Devices';
import { $servers } from '../Servers';
import { $treeModal } from '../TreeModal';

export const $treeDevicesModal = combine(
	$servers,
	$devices,
	$channels,
	$treeModal,
	(serversModel, devicesModel, channelsModel, treeModal) => {
		const { list: serversList } = serversModel;
		const { list: devicesList } = devicesModel;
		const { list: channelsList } = channelsModel;
		const treeServers = convertServersToTree(serversList);
		const treeDevices = convertDevicesToTree(devicesList);
		const treeChannels = convertChannelsToTreeModal(channelsList, treeModal);
		return [...treeServers, ...treeDevices, ...treeChannels];
	},
);

export const $treePickableDevices = combine(
	$servers,
	$devices,
	$channels,
	$treeModal,
	(serversModel, devicesModel, channelsModel, treeModal) => {
		const { list: serversList } = serversModel;
		const { list: devicesList } = devicesModel;
		const { list: channelsList } = channelsModel;
		const treeServers = convertServersToTree(serversList);
		const treeDevices = convertPickableDevicesToTree(
			devicesList,
			treeModal.deviceId,
		);
		const treeChannels = convertChannelsToTree(channelsList);
		return [...treeServers, ...treeDevices, ...treeChannels];
	},
);
