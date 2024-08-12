import { ForwardedRef, forwardRef, memo, MouseEvent } from 'react';
import { clsx } from 'clsx';

import { DataTableCell, DataTableProps } from './types';

import styles from './DataTable.module.css';

const cellRenderFunc = ({
	cellId,
	cellClassName,
	title,
	content,
}: DataTableCell) => {
	return (
		<div
			className={`${styles.column_cell} ${cellClassName}`}
			title={title}
			key={cellId}
		>
			{content}
		</div>
	);
};

const DataTable = forwardRef(function DataTable(
	{
		className,
		stickyCellsCount,
		headerData,
		headerClassName,
		bodyData,
		bodyClassName,
		orientation,
		onScroll,
		onContextMenu,
		selectedInstrumentNumber,
	}: DataTableProps,
	ref: ForwardedRef<HTMLDivElement>,
) {
	const tableBodyClassName = clsx(
		orientation === 'row' ? styles.body_row : styles.body,
		bodyClassName,
	);

	return (
		<div className={`${styles.table} ${className || ''}`}>
			{headerData ? (
				<div className={`${styles.header} ${headerClassName || ''}`}>
					{headerData.map(({ cellId, cellClassName, title, content }) => {
						return (
							<div
								className={`${styles.header_cell} ${cellClassName}`}
								title={title}
								key={cellId}
							>
								{content}
							</div>
						);
					})}
				</div>
			) : null}
			<div className={tableBodyClassName} ref={ref} onScroll={onScroll}>
				{bodyData.map(
					({
						columnClassName,
						columnId,
						columnStyle,
						cells,
						equipmentNumber,
					}) => {
						const tableColumnClassName = clsx(
							orientation === 'row'
								? styles.cells_container_row
								: styles.cells_container,
							columnClassName,
							{
								[styles.row__selected]:
									selectedInstrumentNumber === equipmentNumber,
							},
						);

						const isStickyCellsExists = stickyCellsCount !== undefined;

						const staticCells: DataTableCell[] = !isStickyCellsExists
							? cells
							: [];

						const stickyCells: DataTableCell[] = [];

						if (isStickyCellsExists) {
							cells.forEach((cell, cellIndex) => {
								if (cellIndex < stickyCellsCount) {
									stickyCells.push(cell);
								} else {
									staticCells.push(cell);
								}
							});
						}

						const handleContextMenu = (evt: MouseEvent) => {
							if (onContextMenu && equipmentNumber) {
								onContextMenu(evt, equipmentNumber);
							}
						};
						return (
							<div
								className={tableColumnClassName}
								style={columnStyle}
								key={columnId}
								id={columnId}
								onContextMenu={handleContextMenu}
							>
								{isStickyCellsExists ? (
									<div className={styles.sticky_container}>
										{stickyCells.map(cellRenderFunc)}
									</div>
								) : null}
								{staticCells.map(cellRenderFunc)}
							</div>
						);
					},
				)}
			</div>
		</div>
	);
});

export default memo(DataTable);
