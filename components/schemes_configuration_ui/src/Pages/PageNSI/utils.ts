import { openModal } from '../../Models/Modal/events';
import { RegisteredModals } from '../../Shared/modalsConfig';
import { TreeItem } from '../../UI/Tree/types';

export function getParent(
	tree: TreeItem[],
	currentNode: TreeItem | null,
	parentType: string,
): TreeItem | null {
	if (currentNode === null) {
		return null;
	}
	if (currentNode.type === parentType) {
		return currentNode;
	}
	const currentParent: TreeItem | null =
		tree.find(
			({ id, type }) =>
				id === currentNode.parentId && type === currentNode.parentType,
		) || null;

	return getParent(tree, currentParent, parentType);
}
export function getParentId(
	tree: TreeItem[],
	currentNode: TreeItem | null,
	parentType: string,
): number | null {
	return getParent(tree, currentNode, parentType)?.id || null;
}
export function getParentChildren(
	tree: TreeItem[],
	parentId: number | null,
	parentType: string | undefined,
	excludedId: number | null = null,
): TreeItem[] {
	return tree.filter(
		(treeItem: TreeItem) =>
			treeItem.parentId === parentId &&
			treeItem.parentType === parentType &&
			treeItem.id !== excludedId,
	);
}
export function getChildNodeWithParentType(
	tree: TreeItem[],
	id: number,
	parentType: string,
	itemNumber?: string | null,
): TreeItem | null {
	return (
		tree.find(
			(treeItem: TreeItem) =>
				(treeItem.id === id ||
					(treeItem.itemNumber === itemNumber && itemNumber !== null)) &&
				treeItem.parentType === parentType,
		) || null
	);
}
export function getEquipmentParentChannel(
	tree: TreeItem[],
	equipment: TreeItem,
) {
	const itemWithChannel = getChildNodeWithParentType(
		tree,
		equipment.id,
		'nsi_channel',
		equipment.itemNumber,
	);
	const parentChannel: TreeItem | null = getParent(
		tree,
		itemWithChannel,
		'nsi_channel',
	);

	return parentChannel;
}
export function getAvailableChannelsForEquipment(
	tree: TreeItem[],
	equipment: TreeItem,
) {
	const parentNode: TreeItem | null = getParent(tree, equipment, 'node');
	const parentNodeId: number | null = parentNode?.id || null;
	const nodeChildren: TreeItem[] = getParentChildren(
		tree,
		parentNodeId,
		'node',
	);
	const channels = nodeChildren.find(({ type }) => type === 'channels');
	const availableChannels = getParentChildren(
		tree,
		channels?.id || null,
		'channels',
	).filter(
		(channel: TreeItem) =>
			!tree.some(
				({ parentId, type }) =>
					parentId === channel.id && type === 'equipment_piece',
			),
	);

	return availableChannels;
}
export function getEquipmentsToLink(tree: TreeItem[], equipment: TreeItem) {
	if (equipment.parentId) {
		const itemsToMove: TreeItem[] = getParentChildren(
			tree,
			equipment.parentId,
			equipment.type === 'nsi_channel' ? 'channels' : 'equipment_pieces',
		);
		const availableEquipmentPieces: TreeItem[] = itemsToMove.filter(
			(item) =>
				!tree.some(
					({ itemNumber, parentType }) =>
						item.itemNumber === itemNumber && parentType === 'nsi_channel',
				),
		);

		return availableEquipmentPieces;
	}

	return [];
}
export function getAvailableNodes(tree: TreeItem[], treeItem: TreeItem) {
	const parentDeviceId: number | null = getParentId(tree, treeItem, 'device');
	const availableNodes: TreeItem[] = getParentChildren(
		tree,
		parentDeviceId,
		'device',
	);

	return availableNodes;
}
export function getChannelsToMove(tree: TreeItem[], channel: TreeItem) {
	if (channel.parentId) {
		const itemsToMove: TreeItem[] = getParentChildren(
			tree,
			channel.parentId,
			'channels',
		);
		return itemsToMove;
	}

	return [];
}

export const handleOpenCreateNodeModal = () => {
	openModal(RegisteredModals.CreateNodeNSI);
};
export const handleOpenEditNodeModal = () => {
	openModal(RegisteredModals.EditNodeNSI);
};
export const handleOpenDeleteNodeModal = () => {
	openModal(RegisteredModals.DeleteNodeNSI);
};
export const handleOpenChangeChannelEquipmentNodeModal = () => {
	openModal(RegisteredModals.ChangeNodeNSI);
};
export const handleOpenLinkEquipmentToChannelModal = () => {
	openModal(RegisteredModals.LinkEquipmentToChannelNSI);
};
export const handleOpenUnlinkEquipmentModal = () => {
	openModal(RegisteredModals.UnlinkEquipmentNSI);
};
