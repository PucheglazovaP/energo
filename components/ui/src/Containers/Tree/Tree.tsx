import clsx from 'clsx';

import useUnitsTree from '../../Hooks/Preferences/useUnitsTree';
import { UnitsTreeItem, UnitsTreeProps } from '../../Types/UnitsTreeTypes';

import TreeItem from './TreeItem';
import { sortTree } from './utils';

import styles from './Tree.module.css';

function Tree({
	className,
	style,
	parentId,
	onItemClick,
	searchItems,
}: UnitsTreeProps) {
	const tree: UnitsTreeItem[] = useUnitsTree(parentId, searchItems);
	const orderedTree: UnitsTreeItem[] = tree.sort(sortTree);
	return (
		<ul className={clsx(styles.root, className)} style={style}>
			{orderedTree.map((treeItem, index) => {
				return (
					<TreeItem
						key={`${treeItem.id}-${index}`}
						name={treeItem.name}
						displayName={treeItem.displayName}
						treeItemId={treeItem.id}
						isTreeItemOpen={treeItem.isOpen}
						onItemClick={onItemClick}
						isLast={treeItem.isLast}
					/>
				);
			})}
		</ul>
	);
}

export default Tree;
