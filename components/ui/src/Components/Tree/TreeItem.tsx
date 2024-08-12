import { memo, useCallback, useMemo } from 'react';
import clsx from 'clsx';

import { Arrow } from '../Icons';
import { ArrowDirection } from '../Icons/types';

import { TreeItemProps } from './types';
import styles from './Tree.module.scss';

function TreeItem(props: TreeItemProps) {
	const { tree, onExpand, isLast } = props;

	const handleExpand = useCallback(() => {
		onExpand(tree.id);
	}, [onExpand, tree.id]);

	const isLastTree = useMemo(() => {
		return tree.children.every((child) => !child.children.length);
	}, [tree.children]);

	return (
		<div>
			<div className={styles.item} data-tree-id={tree.id}>
				{isLast || !tree.children.length ? (
					<div />
				) : (
					<button className={styles.expand} onClick={handleExpand}>
						<Arrow
							direction={
								tree.isExpanded ? ArrowDirection.DOWN : ArrowDirection.RIGHT
							}
						/>
					</button>
				)}
				<div
					className={clsx(styles.item__content, {
						[styles.item__isLast]: isLast,
					})}
				>
					{tree.renderFn ? tree.renderFn() : tree.name}
				</div>
			</div>
			{tree.isExpanded && (
				<div className={styles.item__children}>
					{tree.children.map((childTree) => (
						<TreeItem
							tree={childTree}
							onExpand={onExpand}
							isLast={isLastTree}
							key={childTree.id}
						/>
					))}
				</div>
			)}
		</div>
	);
}

export default memo(TreeItem);
