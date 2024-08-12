import { useEffect, useMemo, useState } from 'react';
import { Select } from '@evraz/ui-kit';
import { SelectOption } from '@evraz/ui-kit/dist/src/Shared/Types/SelectCommonProps';
import { useStore } from 'effector-react';

import { NodeItemsActions } from '../../Const/Queries/nodeItems/types';
import { $user } from '../../Models/Auth';
import { closeModal } from '../../Models/Modal/events';
import { $nodeItems } from '../../Models/NodeItems';
import {
	getNodeItemsListFx,
	linkEquipmentPieceFx,
	updateEquipmentPieceNodeFx,
} from '../../Models/NodeItems/effects';
import { NSINodeItem } from '../../Models/NodeItems/types';
import {
	$nsiAvailableChannels,
	$nsiCurrentParentNode,
	$nsiParentChannel,
	$nsiSelectedNode,
} from '../../Models/NSISelectedUnit';
import { RegisteredModals } from '../../Shared/modalsConfig';
import { User } from '../../Shared/types';
import { ModuleName } from '../../Shared/Types/moduleName';
import { TreeItem } from '../../UI/Tree/types';

import styles from './ModalChangeChannelNSI.module.css';

function useChangeChannelNSI() {
	const user: User | null = useStore($user);
	const selectedNode: TreeItem | null = useStore($nsiSelectedNode);
	const availableChannels: TreeItem[] = useStore($nsiAvailableChannels);
	const nodeItems = useStore($nodeItems);
	const parentChannel: TreeItem | null = useStore($nsiParentChannel);
	const currentNode: TreeItem | null = useStore($nsiCurrentParentNode);

	const [newChannel, setNewChannel] = useState<string>('');

	function handleSelectChange(option: SelectOption) {
		setNewChannel(option.id);
	}

	function handleClose() {
		closeModal(RegisteredModals.LinkEquipmentToChannelNSI);
	}
	function handleConfirm() {
		if (user && selectedNode && selectedNode.itemNumber && currentNode) {
			if (parentChannel) {
				if (selectedEquipmentPiece && selectedEquipmentPiece.linkLastModified)
					updateEquipmentPieceNodeFx({
						userId: user.preferredUsername,
						newNodeId: currentNode.id,
						newChannelId: Number(newChannel),
						linkId: selectedEquipmentPiece?.linkId,
						linkLastModified: selectedEquipmentPiece?.linkLastModified,
						moduleName:
							ModuleName.UseChangeChannelNSI_updateEquipmentPieceNodeFx,
					});
			} else {
				linkEquipmentPieceFx({
					userId: user.preferredUsername,
					equipmentId: selectedNode.itemNumber,
					newNodeId: currentNode.id,
					newChannelId: Number(newChannel),
					moduleName: ModuleName.UseChangeChannelNSI_linkEquipmentPieceFx,
				});
			}

			getNodeItemsListFx({
				userId: user.preferredUsername,
				nodeId: currentNode.id,
				action: NodeItemsActions.Set,
				moduleName: ModuleName.UseChangeChannelNSI_getNodeItemsListFx,
			});
		}

		handleClose();
	}

	const selectedEquipmentPiece: NSINodeItem | null = useMemo(() => {
		return nodeItems.list.find(({ id }) => id === selectedNode?.id) || null;
	}, [selectedNode, nodeItems]);
	const currentNodeName: string = useMemo(() => {
		return parentChannel?.displayName || '-';
	}, [parentChannel]);

	const newNodes: SelectOption[] = useMemo(() => {
		return availableChannels
			.filter(({ id }) => id !== parentChannel?.id)
			.map((node: TreeItem) => ({
				name: node.displayName,
				id: String(node.itemNumber),
				isSelected: false,
			}));
	}, [parentChannel, availableChannels]);

	const newNodesElement: JSX.Element = useMemo(
		() =>
			newNodes.length === 1 ? (
				<div className={styles.field_value}>{newNodes[0].name}</div>
			) : (
				<Select
					options={newNodes}
					onChange={handleSelectChange}
					value={newChannel}
					className={styles.select}
				/>
			),
		[newNodes, newChannel],
	);

	const currentNodeTitle: string = 'Текущий канал';
	const newNodeTitle: string = 'Новый канал';
	const checkboxTitle: string = 'Единица оборудования к привязке';
	const equipmentPieceTitle: string = selectedNode?.displayName || '-';
	const isConfirmButtonDisabled: boolean = !newChannel;

	useEffect(() => {
		if (!newChannel && newNodes.length > 0) {
			setNewChannel(newNodes[0].id);
		}
	}, [newNodes, newChannel]);

	return {
		currentNodeName,
		newNodesElement,
		checkboxTitle,
		equipmentPieceTitle,
		isConfirmButtonDisabled,
		currentNodeTitle,
		newNodeTitle,
		handleClose,
		handleConfirm,
	};
}

export default useChangeChannelNSI;
