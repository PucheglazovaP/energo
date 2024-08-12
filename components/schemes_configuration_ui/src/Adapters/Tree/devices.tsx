import { Tooltip, TooltipDirection } from '@evraz/ui-kit';

import DeviceNode from '../../Containers/PointChannelsTreeModal/parts/DeviceNode';
import { Device as DeviceIcon } from '../../Icons';
import { Device } from '../../Models/Devices/types';
import { TreeItem } from '../../UI/Tree/types';

import styles from './Tree.module.css';

export function convertDevicesToTree(devices: Device[]): TreeItem[] {
	const tree: TreeItem[] = devices.map(
		({ id, name, serverId, order, isOpen }) => ({
			id,
			displayName: name,
			name,
			parentId: serverId,
			parentType: 'server',
			type: 'device',
			order,
			isLast: false,
			isOpen,
			renderFn: () => (
				<div className={styles.display_name}>
					<Tooltip tooltip="Прибор" forceDirection={TooltipDirection.Down}>
						<div>
							<DeviceIcon className={styles.display_name_icon} />
						</div>
					</Tooltip>
					{name}
				</div>
			),
		}),
	);
	return tree;
}

export function convertDeviceToTree(device: Device): TreeItem {
	return {
		id: device.id,
		displayName: device.name,
		name: device.name,
		parentId: device.serverId,
		parentType: 'server',
		type: 'device',
		order: device.order,
		isLast: false,
		isOpen: device.isOpen,
	};
}

export function convertPickableDevicesToTree(
	devices: Device[],
	selectedId: number | undefined,
): TreeItem[] {
	const tree: TreeItem[] = devices.map((device) => ({
		id: device.id,
		displayName: device.name,
		name: device.name,
		parentId: device.serverId,
		parentType: 'server',
		type: 'device',
		order: device.order,
		isLast: false,
		isOpen: device.isOpen,
		renderFn: () => <DeviceNode device={device} selectedId={selectedId} />,
	}));
	return tree;
}
