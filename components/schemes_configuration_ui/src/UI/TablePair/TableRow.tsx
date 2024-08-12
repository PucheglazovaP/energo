import React, { useEffect, useRef, useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import clsx from 'clsx';

import useOnScreen from '../../Facades/Tree/useOnScreen';

import { TableRowProps, TableValue, TableValueFormatter } from './types';
import { getColumnCells } from './utils';

import styles from './TablePair.module.css';

function TableRow({
	className,
	style,
	data,
	isHeader,
	isSelected,
	allRows = [],
	rowIndex,
	isDraggable,
}: TableRowProps) {
	const [isHover, setIsHover] = useState(false);
	const containerRef = useRef<HTMLTableRowElement>(null);
	const isVisibleOnScreen = useOnScreen(containerRef);

	const handleMouseEnter = () => {
		isHeader ? setIsHover(false) : setIsHover(true);
	};

	const handleMouseLeave = () => setIsHover(false);

	const draggableRowStyle = data.reduce((acc, curr) => {
		if (curr.width) {
			return `${acc} ${curr.width}px`;
		}
		return `${acc} 1fr`;
	}, '');

	const renderCells = () => {
		return (
			<>
				{data.map((cell, columnIndex) => {
					const formatValue =
						cell.formatCell ||
						((value: TableValue) => (value != null ? String(value) : ' '));
					const renderCell: any =
						cell.renderCell ||
						(({
							value,
							formatValue,
						}: {
							value: TableValue;
							formatValue: TableValueFormatter;
						}) => formatValue(value));

					return (
						<div
							className={clsx(
								styles.cell,
								className,
								isHover && styles.hover,
								isHeader && styles.header,
								isHeader ? '' : styles.height,
								columnIndex === 0 && styles.first_cell,
								columnIndex === data.length - 1 && styles.last_cell,
								isSelected && styles.selected,
							)}
							style={style}
							key={cell.name}
							onMouseEnter={handleMouseEnter}
							onMouseLeave={handleMouseLeave}
							ref={containerRef}
						>
							<div className={styles.value}>
								{renderCell({
									value: cell.value,
									formatValue,
									columnValues: [...getColumnCells(allRows, columnIndex)],
									rowIndex,
									isHover,
								})}
							</div>
						</div>
					);
				})}
			</>
		);
	};

	useEffect(() => {
		if (containerRef.current && isSelected && !isVisibleOnScreen) {
			containerRef.current.scrollIntoView({
				block: 'center',
			});
		}
	}, [isSelected]);

	return isDraggable ? (
		<Draggable
			draggableId={rowIndex.toString()}
			index={rowIndex}
			isDragDisabled={isDraggable && isHeader}
		>
			{(provided) => (
				<div
					{...provided.draggableProps}
					{...provided.dragHandleProps}
					ref={provided.innerRef}
				>
					<div
						style={{
							display: 'grid',
							gridTemplateColumns: draggableRowStyle,
						}}
					>
						{renderCells()}
					</div>
				</div>
			)}
		</Draggable>
	) : (
		<>{renderCells()}</>
	);
}

export default TableRow;
