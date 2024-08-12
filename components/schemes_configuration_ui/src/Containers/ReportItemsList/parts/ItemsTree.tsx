import React, { useMemo } from 'react';
import { AngleDown } from '@evraz/ui-kit';
import clsx from 'clsx';

import { Dot } from '../../../Icons';
import { ReportItem } from '../../../Models/ReportItems/types';

import styles from '../ReportItemsList.module.css';

function TreeLeaf({
	node,
	onExpand,
	treeData,
	onOpen,
	draggableId,
	focusedId,
}: {
	node: ReportItem;
	onExpand: (id: number) => void;
	treeData: ReportItem[];
	onOpen: (e: React.MouseEvent, id: number) => void;
	draggableId: number;
	focusedId: number;
}) {
	const { isOpen } = node;
	const hasNodeChildren = Boolean(
		treeData.find((item) => item.parentId === node.id),
	);
	const isActive = draggableId === node.id || focusedId === node.id;

	function handleOpen(evt: React.MouseEvent) {
		if (draggableId !== node.id) onOpen(evt, node.id);
	}

	return (
		<li>
			<div className={styles.wrapper}>
				{hasNodeChildren ? (
					<button className={styles.btn} onClick={() => onExpand(node.id)}>
						<AngleDown
							className={clsx(
								styles.arrow,
								isOpen ? styles['arrow--down'] : '',
							)}
						/>
					</button>
				) : (
					<Dot className={styles.dot} />
				)}
				<div
					className={clsx(
						styles.leaf_data,
						isActive && styles.leaf_data__active,
					)}
					onContextMenu={handleOpen}
				>
					<div className={styles.position_name}>{node.positionName}</div>
					<div
						className={clsx(
							styles.calculated,
							node.isCalculated && styles.calculated__active,
						)}
					>
						<span>{node.isCalculated ? 'Да' : 'Нет'}</span>
					</div>
					<div className={styles.point_name}>
						{node.pointName ? (
							<p title={node.pointName}>{node.pointName}</p>
						) : (
							<span>Нет</span>
						)}
					</div>
					<div className={styles.coefficient}>{node.coefficient ?? '-'}</div>
				</div>
			</div>
			{isOpen && (
				<ItemsTree
					onExpand={onExpand}
					treeData={treeData}
					parentId={node.id}
					onOpen={onOpen}
					draggableId={draggableId}
					focusedId={focusedId}
				/>
			)}
		</li>
	);
}

function ItemsTree({
	treeData,
	onExpand,
	parentId = null,
	onOpen,
	draggableId,
	focusedId,
}: {
	treeData: ReportItem[];
	onExpand: (id: number) => void;
	parentId?: number | null;
	onOpen: (e: React.MouseEvent, id: number) => void;
	draggableId: number;
	focusedId: number;
}) {
	const nodes = useMemo(() => {
		const tree = treeData.filter((item) => item.parentId === parentId);
		return tree;
	}, [parentId, treeData]);
	return (
		<ul className={clsx(styles.root)}>
			{nodes.map((node, index) => {
				return (
					<TreeLeaf
						key={`${node.id}-${index}`}
						node={node}
						onExpand={onExpand}
						treeData={treeData}
						onOpen={onOpen}
						draggableId={draggableId}
						focusedId={focusedId}
					/>
				);
			})}
		</ul>
	);
}

export default ItemsTree;
