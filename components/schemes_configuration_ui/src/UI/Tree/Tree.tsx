import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { AngleDown, Button } from '@evraz/ui-kit';
import clsx from 'clsx';

import useOnScreen from '../../Facades/Tree/useOnScreen';
import useTreeItem from '../../Facades/Tree/useTreeItem';
import { Dot } from '../../Icons';

import { TreeItemProps, TreeProps } from './types';
import { sortTree } from './utils';

import styles from './Tree.module.css';

function TreeItem({
	node,
	onItemClick = () => {},
	onExpand,
	onContextMenu,
	treeData,
	isExpandable,
	needSort,
	withExpand,
	lastPositionNode,
	activeNode,
	isDefaultExpanded,
}: TreeItemProps) {
	const [isTreeItemOpen, setTreeItemOpenState] = useTreeItem(
		treeData,
		node.id,
		isDefaultExpanded ?? false,
		activeNode?.id,
	);

	const onNodeToggleUncontrolled = useCallback(() => {
		setTreeItemOpenState(!isTreeItemOpen);
	}, [isTreeItemOpen, setTreeItemOpenState]);

	const onNodeToggleControlled = useCallback(() => {
		onExpand && onExpand(node);
	}, [node, onExpand]);

	const containerRef = useRef<HTMLDivElement>(null);

	const isVisibleOnScreen = useOnScreen(containerRef);

	const onNodeClick = useCallback(() => {
		if (onItemClick) {
			onItemClick(node);
		}
		if (isExpandable && withExpand) {
			onNodeToggleUncontrolled();
		}
	}, [onItemClick, node, onNodeToggleUncontrolled, isExpandable, withExpand]);

	const isOpen = useMemo(() => {
		if (Object.hasOwn(node, 'isOpen')) {
			return node.isOpen;
		}
		return isTreeItemOpen;
	}, [node, isTreeItemOpen]);

	/*
		Scroll viewport to the active element if it's not visible on the screen
	*/
	useEffect(() => {
		if (
			containerRef.current &&
			String(activeNode?.id) === String(node.id) &&
			String(activeNode?.type) === String(node.type) &&
			!isVisibleOnScreen
		) {
			containerRef.current.scrollIntoView({
				block: 'center',
			});
		}
	}, [node.id, node.type, activeNode?.id, activeNode?.type]);

	/*
		Scroll viewport to the last positioned node
	*/
	useEffect(() => {
		if (
			containerRef.current &&
			node.id === lastPositionNode?.id &&
			node.type === lastPositionNode?.type
		) {
			containerRef.current.scrollIntoView({
				behavior: 'auto',
				block: 'start',
			});
		}
	}, [lastPositionNode, node.id, node.type]);

	return (
		<li data-type={node.type}>
			<div className={styles.wrapper} ref={containerRef}>
				{isExpandable && !node.isLast ? (
					<button
						type="button"
						className={
							isOpen ? styles.btn : clsx(styles.btn, styles['btn--hide'])
						}
						onClick={
							onExpand ? onNodeToggleControlled : onNodeToggleUncontrolled
						}
					>
						<AngleDown
							className={clsx(
								styles.arrow,
								isOpen ? styles['arrow--down'] : '',
							)}
						/>
					</button>
				) : (
					<div className={styles.dot}>
						<Dot />
					</div>
				)}
				<Button
					className={clsx(
						styles.item,
						String(activeNode?.id) === String(node.id)
							? styles['item--active']
							: '',
					)}
					onClick={onNodeClick}
					onContextMenu={(evt: React.MouseEvent<HTMLButtonElement>) =>
						onContextMenu && onContextMenu(evt, node.id, node)
					}
				>
					{node.renderFn ? node.renderFn() : node.displayName}
				</Button>
			</div>
			{isOpen && (
				<Tree
					parentId={node.id}
					parentType={node.type}
					onItemClick={onItemClick}
					onExpand={onExpand}
					onContextMenu={onContextMenu}
					treeData={treeData}
					isExpandable={isExpandable}
					needSort={needSort}
					withExpand={withExpand}
					lastPositionNode={lastPositionNode}
					activeNode={activeNode}
				/>
			)}
		</li>
	);
}

function Tree({
	className,
	style,
	parentId,
	onItemClick,
	onExpand,
	onContextMenu,
	treeData,
	isExpandable = true,
	needSort = false,
	withExpand = false,
	lastPositionNode,
	parentType,
	activeNode,
	isDefaultExpanded = false,
}: TreeProps) {
	const nodes = useMemo(() => {
		let tree = treeData.filter((node) => node.parentId === parentId);
		if (parentType) {
			tree = tree.filter((node) => node.parentType === parentType);
		}

		return needSort ? tree.sort(sortTree) : tree;
	}, [treeData, parentType, needSort, parentId]);

	return (
		<ul className={clsx(styles.root, className)} style={style}>
			{nodes.map((node, index) => {
				return (
					<TreeItem
						key={`${node.id}-${index}`}
						node={node}
						onItemClick={onItemClick}
						onContextMenu={onContextMenu}
						treeData={treeData}
						isExpandable={isExpandable}
						needSort={needSort}
						withExpand={withExpand}
						lastPositionNode={lastPositionNode}
						onExpand={onExpand}
						activeNode={activeNode}
						isDefaultExpanded={isDefaultExpanded}
					/>
				);
			})}
		</ul>
	);
}

export default Tree;
