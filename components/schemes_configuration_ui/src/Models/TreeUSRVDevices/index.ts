import { combine, createStore } from 'effector';

import { convertPickableDevicesToTree } from '../../Adapters/Tree/devices';
import { convertServersToTree } from '../../Adapters/Tree/servers';
import { $channels } from '../Channels';
import { $devicesURSV510 } from '../Devices';
import { $servers } from '../Servers';
import { $treeModal } from '../TreeModal';

import { resetSearchValue, setSearchValue } from './events';
import { getFilteredDevices } from './utils';

export const $searchValue = createStore<string>('');
export const $treePickableDevicesURSV510 = combine(
	$treeModal,
	$servers,
	$channels,
	$devicesURSV510,
	$searchValue,
	(treeModal, servers, channels, devices, searchValue) => {
		const treeServers = convertServersToTree(servers.list);
		const filteredDevices = getFilteredDevices(devices.list, searchValue);
		const treeDevices = convertPickableDevicesToTree(
			filteredDevices,
			treeModal.deviceId,
		);

		return [...treeServers, ...treeDevices];
	},
);

$searchValue.on(setSearchValue, (_state, searchValue) => searchValue);
$searchValue.reset(resetSearchValue);
