import { TreeItem } from '../UI/Tree/types';

// Filter tree by 'displayName' parameter
// Construct tree with matched nodes without it's parentId,
// but with possibility to expand it's childs
export function getFilteredTree(tree: TreeItem[], name: string): TreeItem[] {
	if (!name) {
		return tree;
	}
	const validName = name.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
	const nameMask: RegExp = new RegExp(validName, 'gi');
	const rootNodes: TreeItem[] = tree
		.filter((node) => nameMask.test(node.displayName))
		.map((node) => ({ ...node, parentId: undefined }));
	const subNodes = tree.filter((node) => node.parentId);
	// If there is no overlap by name, return empty array
	const finalTree: TreeItem[] = rootNodes.length
		? [...rootNodes, ...subNodes]
		: [];
	return finalTree;
}
export function filterTreeById(
	tree: { id: number; parentId: number | undefined }[],
	id: number,
) {
	let filteredTree: { id: number; parentId: number | undefined }[] = [];
	for (let node of tree) {
		if (node.id === id) {
			filteredTree.push(node);
		} else if (node.parentId === id) {
			filteredTree.push(node);
			let children = filterTreeById(tree, node.id);
			filteredTree = filteredTree.concat(children);
		}
	}
	return filteredTree;
}
export function removeNodeAndHisChildren(
	tree: { id: number; parentId: number | undefined }[],
	id: number,
) {
	const getNodeAndHisChildren = (
		id: number,
	): { id: number; parentId: number | undefined }[] => {
		const node = tree.find((node) => node.id === id);
		if (!node) {
			return [];
		}
		const children = tree.filter((item) => item.parentId === id);
		return [
			node,
			...children.flatMap((item) => getNodeAndHisChildren(item.id)),
		];
	};

	const nodesToRemove = getNodeAndHisChildren(id).map((node) => node.id);
	return tree.filter((node) => !nodesToRemove.includes(node.id));
}
