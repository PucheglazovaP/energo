import { useCallback, useEffect, useRef } from 'react';
import { Button } from '@evraz/ui-kit';
import clsx from 'clsx';

import useAppDispatch from '../../Hooks/Store/useAppDispatch';
import { useAppSelector } from '../../Hooks/Store/useAppSelector';
import useOnScreen from '../../Hooks/useOnScreen';
import ArrowDown from '../../Icons/ArrowDown';
import {
	setActiveUnit,
	setUnitsOpen,
} from '../../Store/reducers/PreferenceSlice/preferenceSlice';
import { UnitsTreeItemProps } from '../../Types/UnitsTreeTypes';

import Tree from './Tree';

import styles from './Tree.module.css';

function TreeItem({
	displayName,
	treeItemId,
	isTreeItemOpen,
	onItemClick = () => {},
	isLast,
}: UnitsTreeItemProps) {
	const dispatch = useAppDispatch();

	const handleArrowClick = useCallback(
		(id: number, isTreeItemOpen: boolean) => {
			dispatch(setUnitsOpen({ id, isOpen: !isTreeItemOpen }));
		},
		[setUnitsOpen],
	);
	const { activeUnit } = useAppSelector((state) => state.preferenceReducer);
	const containerRef = useRef<HTMLDivElement>(null);
	const isNotVisibleOnScreen = useOnScreen(containerRef);

	const itemHandleClick = useCallback(() => {
		if (isLast) {
			onItemClick && onItemClick(treeItemId, displayName);
			dispatch(setActiveUnit(treeItemId));
		}
	}, [isLast, onItemClick, treeItemId, displayName]);

	useEffect(() => {
		if (containerRef.current && isNotVisibleOnScreen) {
			containerRef.current.scrollIntoView({ behavior: 'smooth' });
		}
	}, [containerRef, treeItemId]);

	return (
		<li>
			<div className={styles.wrapper} ref={containerRef}>
				{!isLast && (
					<button
						type="button"
						className={
							isTreeItemOpen
								? styles.btn
								: clsx(styles.btn, styles['btn--hide'])
						}
						onClick={() => {
							handleArrowClick(treeItemId, isTreeItemOpen);
						}}
					>
						<ArrowDown
							className={clsx(
								styles.arrow,
								isTreeItemOpen ? styles['arrow--down'] : '',
							)}
						/>
					</button>
				)}
				<Button
					className={clsx(
						styles.item,
						isLast && styles['item--last'],
						activeUnit === treeItemId ? styles['item--active'] : '',
					)}
					onClick={itemHandleClick}
				>
					{displayName}
				</Button>
			</div>
			{isTreeItemOpen && (
				<Tree parentId={treeItemId} onItemClick={onItemClick} />
			)}
		</li>
	);
}

export default TreeItem;
