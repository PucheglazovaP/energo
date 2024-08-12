import React, { useEffect, useState } from 'react';
import clsx from 'clsx';

import { SERVER } from '../../Const';
import { useAppSelector } from '../../Hooks/Store/useAppSelector';
import useTreeItemPagination from '../../Hooks/TreeItem/useTreeItemPagination';
import useTreeItemWrapping from '../../Hooks/TreeItem/useTreeItemWrapping';
import { TreeHeadersProps, TreeItemProps } from '../../Types';

import styles from './TreeItem.module.scss';

function renderDefaultHeader({
	number,
	onClick,
}: TreeHeadersProps): JSX.Element {
	return (
		<button onClick={onClick} className={styles.title}>
			{number}
		</button>
	);
}

function TreeItem({
	renderHeader = renderDefaultHeader,
	className,
	title,
	number,
	eWorkNumber,
	children,
	treeItemType,
	isFavourite,
	activeFormula,
	hasFormula,
	count,
	isDropdownDisabled = false,
	coefficient,
	treeType,
	isIncluded,
	onClick,
	setContextMenu,
	contextMenuType,
	currentParent,
	updateElementsLists,
	serverId,
	renderChildren,
}: TreeItemProps) {
	const { isOpen, handleOpenTreeItem } = useTreeItemWrapping(
		number,
		treeType,
		treeItemType,
	);
	const { currentPagination, isListFetching, topRef, bottomRef } =
		useTreeItemPagination(number, treeType, treeItemType);

	useEffect(() => {
		if (isOpen && updateElementsLists) {
			updateElementsLists({
				fkNumber: number,
				treeType: treeType,
				itemType: treeItemType,
				serverId: serverId,
			});
		}
	}, [isOpen]);

	const [isTreeItemActive, setTreeItemActive] = useState<boolean>(false);

	const { parameterItems } = useAppSelector((state) => state.parameterReducer);
	useEffect(() => {
		const item = parameterItems.find(
			(item) =>
				item.parameterId === number && item.parameterType === treeItemType,
		);

		setTreeItemActive(!!item);
	}, [parameterItems, number, treeItemType]);

	return (
		<li className={clsx(styles.tree, className)} style={styles}>
			<div className={styles.tree__header}>
				<div className={isDropdownDisabled ? styles.tree__noDropdownBtn : ''}>
					{!isDropdownDisabled && (
						<button
							type="button"
							className={
								isOpen ? styles.btn : clsx(styles.btn, styles.btn__hide)
							}
							onClick={handleOpenTreeItem}
						/>
					)}
				</div>
				{renderHeader({
					title,
					number,
					eWorkNumber,
					activeFormula,
					hasFormula,
					count,
					isFavourite,
					onClick,
					coefficient,
					headerType: treeItemType,
					isDropdownDisabled,
					treeType,
					isIncluded,
					isTreeItemActive,
					setTreeItemActive,
					setContextMenu,
					contextMenuType,
					currentParent,
					serverId,
				})}
			</div>
			{currentPagination.paginationAvailable &&
				isOpen &&
				renderChildren &&
				treeItemType === SERVER &&
				!isListFetching && (
					<div
						className={clsx(styles.intersection, styles.intersection__top)}
						ref={topRef}
					/>
				)}
			{isOpen && <ul className={styles.tree__body}>{children}</ul>}
			{isOpen &&
				renderChildren &&
				treeItemType === SERVER &&
				!isListFetching && (
					<div
						className={clsx(styles.intersection, styles.intersection__bottom)}
						ref={bottomRef}
					/>
				)}
		</li>
	);
}

export default TreeItem;
