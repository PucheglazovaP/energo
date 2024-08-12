import { TreeItem } from './types';

/**
 * Sort tree by order property.
 * If order is undefined, nodes considered equal
 * @param leftNode left node
 * @param rightNode right node
 */
export function sortTree(leftNode: TreeItem, rightNode: TreeItem) {
	if (leftNode.order === undefined || rightNode.order === undefined) return 0;
	return leftNode.order - rightNode.order;
}
