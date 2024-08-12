import { useCallback, useMemo } from 'react';
import clsx from 'clsx';

import Arrow from '../Icons/Arrow';
import { ArrowDirection } from '../Icons/types';

import TreeItem from './TreeItem';
import { TreeProps } from './types';
import styles from './Tree.module.scss';

function Tree(props: TreeProps) {
	const { items, name, onExpand, className } = props;

	const toggleAll = useCallback(() => onExpand(), [onExpand]);

	const isExpanded = useMemo(
		() => items.every((item) => item.isExpanded),
		[items],
	);

	return (
		<div className={clsx(styles.tree, className)}>
			<div className={styles.header}>
				<div>
					<button className={styles.expand} onClick={toggleAll}>
						<Arrow
							direction={
								isExpanded ? ArrowDirection.DOWN : ArrowDirection.RIGHT
							}
						/>
					</button>
				</div>
				<span>{name}</span>
			</div>
			<div>
				{items.map((item) => (
					<TreeItem tree={item} key={item.id} onExpand={onExpand} />
				))}
			</div>
		</div>
	);
}

export default Tree;
