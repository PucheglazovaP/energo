import React from 'react';

import { onCloseReportItems } from '../../Models/ReportItems/events';
import ContextMenu from '../../UI/ContextMenu';

import ItemsHeader from './parts/ItemsHeader';
import ItemsTree from './parts/ItemsTree';
import { useReportItemsList } from './useReportItemsList';

import styles from './ReportItemsList.module.css';

function ReportItemsList() {
	const {
		filteredTree,
		handleExpand,
		handlePositionName,
		handlePointName,
		pointName,
		positionName,
		items,
		position,
		setPosition,
		onOpen,
		isDndMode,
		moveItems,
		onCloseContextMenu,
		draggableId,
		focusedId,
	} = useReportItemsList();
	return (
		<div className={styles.report_items}>
			<ItemsHeader
				handlePositionName={handlePositionName}
				handlePointName={handlePointName}
				positionName={positionName}
				pointName={pointName}
				handleCloseItems={onCloseReportItems}
			/>
			<ItemsTree
				treeData={filteredTree}
				onExpand={handleExpand}
				onOpen={onOpen}
				draggableId={draggableId}
				focusedId={focusedId}
			/>
			<ContextMenu
				items={isDndMode ? moveItems : items}
				position={position}
				setPosition={setPosition}
				onCloseContextMenu={onCloseContextMenu}
			/>
		</div>
	);
}

export default ReportItemsList;
