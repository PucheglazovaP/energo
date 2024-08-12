import { Dispatch, SetStateAction, useEffect, useState } from 'react';

import { TreeItem } from '../../UI/Tree/types';

/**
 * This hook should be used on the tree node to handle opening / closing node
 * @param treeData tree
 * @param treeItemId id of the node
 * @param isDefaultExpanded default expand list
 * @param activeId id of the active node
 * @returns flag that indicates that node is opened, also function to open/close node
 */
export default function useTreeItem(
	treeData: TreeItem[],
	treeItemId: number,
	isDefaultExpanded: boolean,
	activeId?: number | null,
): [boolean, Dispatch<SetStateAction<boolean>>] {
	const [isTreeItemOpen, setTreeItemOpenState] =
		useState<boolean>(isDefaultExpanded);
	useEffect(() => {
		if (activeId && isAncestor(activeId, treeItemId, treeData)) {
			setTreeItemOpenState(true);
		}
	}, [treeData, activeId, treeItemId]);

	return [isTreeItemOpen, setTreeItemOpenState];
}

/**
 * Determine if the current node is ancestor of the active node
 * @param activeId id of the active node
 * @param itemId id of the node
 * @param treeData tree
 * @returns flag that indicates that the current node is ancestor of the active node
 */
function isAncestor(
	activeId: number,
	itemId: number,
	treeData: TreeItem[],
): boolean {
	if (itemId === activeId) return false;
	let item = treeData.find((item) => item.id === activeId);
	while (item?.parentId) {
		item = treeData.find((i) => i.id === item?.parentId);
		if (item?.id === itemId) return true;
	}
	return false;
}
