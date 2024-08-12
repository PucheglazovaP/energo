import { ChangeEvent, useEffect, useMemo, useRef } from 'react';
import { useStore } from 'effector-react';

import { $user } from '../../Models/Auth';
import { fetchDevicesURSV510Fx } from '../../Models/Devices/effects';
import { getServersListFx } from '../../Models/Servers/effects';
import { setActiveServer } from '../../Models/Servers/events';
import { $treeModal } from '../../Models/TreeModal';
import { setTreeModal } from '../../Models/TreeModal/events';
import { TreeModal } from '../../Models/TreeModal/types';
import {
	$searchValue,
	$treePickableDevicesURSV510,
} from '../../Models/TreeUSRVDevices';
import {
	resetSearchValue,
	setSearchValue,
} from '../../Models/TreeUSRVDevices/events';
import { ModuleName } from '../../Shared/Types/moduleName';
import { ActiveNode, TreeItem } from '../../UI/Tree/types';
import useSettings from '../PrintForms/PrintFormsPositionSettings/useSettings';

function usePrintFormsURSVDevicesList() {
	const tree = useStore($treePickableDevicesURSV510);
	const { position } = useSettings();
	const inputRef = useRef<HTMLInputElement | null>(null);
	const searchValue: string = useStore($searchValue);
	const user = useStore($user);
	const { serverId, channelId, deviceId } = useStore($treeModal);

	function getNodeById(nodeId: number | undefined) {
		return tree.find(({ id }) => id == nodeId);
	}
	const activeDeviceNode = useMemo(
		() => getNodeById(deviceId),
		[tree, deviceId],
	);
	const activeDeviceServerNode = useMemo(
		() => getNodeById(activeDeviceNode?.parentId),
		[tree, activeDeviceNode],
	);
	function handleNodeClick(node: TreeItem) {
		const id = node.id;
		let treeParams: TreeModal = {
			serverId: undefined,
			deviceId: undefined,
			channelId: undefined,
		};
		if (node.type === 'server') {
			setActiveServer(node.isOpen ? 0 : node.id);
		}
		if (node.type === 'device') {
			treeParams = {
				serverId: node.parentId,
				deviceId: id,
				channelId: undefined,
			};
		}

		setTreeModal(treeParams);
	}

	function handleToggleNode(node: TreeItem) {
		if (node.type === 'server') {
			setActiveServer(node.isOpen ? 0 : node.id);
			setTreeModal({
				serverId: node.id,
				deviceId: undefined,
				channelId: undefined,
			});
		}
	}

	function handleSearchValueChange(evt: ChangeEvent<HTMLInputElement>) {
		const { value } = evt.target;
		setSearchValue(value);
	}

	const activeNode: ActiveNode | undefined = useMemo(() => {
		if (channelId) return { id: channelId, type: 'channel' };
		if (deviceId) return { id: deviceId, type: 'device' };
		if (serverId) return { id: serverId, type: 'server' };
		return undefined;
	}, [serverId, deviceId, channelId]);

	useEffect(() => {
		if (user) {
			fetchDevicesURSV510Fx({
				userId: user.preferredUsername,
				moduleName:
					ModuleName.UsePrintFormsURSVDevicesList_fetchDevicesURSV510Fx,
			});
			getServersListFx(user.preferredUsername);
		}
	}, [user]);

	useEffect(() => {
		if (position && position.deviceId && deviceId != position.deviceId) {
			const device = getNodeById(position.deviceId);
			if (device) {
				const server = getNodeById(device.parentId);
				setTreeModal({
					serverId: server?.id,
					deviceId: position.deviceId,
					channelId: undefined,
				});
			}
		}
	}, [position?.deviceId]);

	useEffect(() => {
		if (activeDeviceServerNode && !activeDeviceServerNode.isOpen) {
			setActiveServer(activeDeviceServerNode.id);
		}
	}, [activeDeviceServerNode]);

	useEffect(() => {
		return () => {
			resetSearchValue();
		};
	}, []);

	return {
		handleSearchValueChange,
		searchValue,
		tree,
		inputRef,
		activeNode,
		handleNodeClick,
		handleToggleNode,
		deviceId,
	};
}

export default usePrintFormsURSVDevicesList;
