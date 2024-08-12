import { UnitsTreeItem } from '../../Types/UnitsTreeTypes';

export function sortTree(treeLeft: UnitsTreeItem, treeRight: UnitsTreeItem) {
	return treeLeft.id - treeRight.id;
}
