import { TreeItem } from '../UI/Tree/types';

/**
 * Function to find the root node of the tree by a child node
 * @param node node that needs to find root from
 * @param tree entire tree of nodes
 * @returns root node
 */
export default function findRootNode(
	node: TreeItem,
	tree: TreeItem[],
): TreeItem | undefined {
	// Returns root node
	if (!node.parentId) {
		return node;
	}
	// Looking for ancestor if node has parentType property by parentType and id
	if (node.parentType) {
		const ancestor = tree.find(
			(n) => n.type === node.parentType && n.id === node.parentId,
		);
		if (ancestor) {
			return findRootNode(ancestor, tree);
		}
	} else {
		// else look for ancestor only by id
		const ancestor = tree.find((n) => n.id === node.parentId);
		if (ancestor) {
			return findRootNode(ancestor, tree);
		}
	}
}
