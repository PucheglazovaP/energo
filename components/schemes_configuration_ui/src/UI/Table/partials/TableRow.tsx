import React, { useEffect, useRef } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import clsx from 'clsx';

import useOnScreen from '../../../Facades/Tree/useOnScreen';
import { Dot } from '../../../Icons';
import DragDropIcon from '../../../Icons/DragDrop';
import { DEFAULT_LEVEL_MARGIN } from '../constants';
import { TableRowProps } from '../types';

import styles from '../Table.module.css';

function TableRow({
	headers,
	row,
	depthLevel = 0,
	isDotVisible,
	rowIndex,
	isDraggable = false,
	activeIndex,
}: TableRowProps) {
	const containerRef = useRef<HTMLTableRowElement>(null);
	const isVisibleOnScreen = useOnScreen(containerRef);

	useEffect(() => {
		if (
			containerRef.current &&
			activeIndex === rowIndex &&
			!isVisibleOnScreen
		) {
			containerRef.current.scrollIntoView({
				block: 'center',
			});
		}
	}, [activeIndex, rowIndex]);

	// эффект для фиксирования столбцов таблицы у которых className fixed
	useEffect(() => {
		const length = containerRef?.current?.children.length || 0;
		let offsetLeft = 0;
		for (let i = 0; i < length; i++) {
			const item = containerRef?.current?.children[i] as HTMLElement;
			if (item?.className.includes('fixed')) {
				item.style.position = 'sticky';
				item.style.left = `${offsetLeft}px`;
				item.style.zIndex = '24';
				offsetLeft += item.clientWidth;
			}
		}
	}, [row]);

	return isDraggable ? (
		<Draggable
			draggableId={rowIndex.toString()}
			index={rowIndex}
			key={`row-${rowIndex}`}
			isDragDisabled={!isDraggable}
		>
			{(provided, snapshot) => {
				const style = {
					...provided.draggableProps.style,
					display: snapshot.isDragging ? 'none' : 'table-row',
				};
				const styleDragging = snapshot.isDragging
					? {
							width: 100 + '%',
							display: 'table',
							...provided.draggableProps.style,
					  }
					: { ...provided.draggableProps.style };
				return (
					<>
						<tr
							id={row.id}
							className={clsx(
								styles['row'],
								row.rowClassName && row.rowClassName,
								activeIndex === rowIndex && styles.active_row,
							)}
							{...provided.draggableProps}
							ref={provided.innerRef}
							style={styleDragging}
							onClick={row.onRowClick}
							onMouseEnter={row.onMouseEnter}
							onContextMenu={row.onContextMenu}
						>
							{headers.map((column, columnIndex) => {
								const cellData = row.dataLine.find(
									(item) => column.accessor === item.accessor,
								);
								const sectionIndent =
									columnIndex === 0
										? {
												marginLeft: DEFAULT_LEVEL_MARGIN * depthLevel,
										  }
										: undefined;

								const renderFn =
									cellData && cellData.renderCell ? (
										cellData.renderCell()
									) : column.renderCell && cellData ? (
										column.renderCell({ data: cellData, index: columnIndex })
									) : (
										<p className={styles['text']}>{cellData?.text}</p>
									);
								if (column.isVisible == null || column.isVisible)
									return (
										<td
											className={clsx(styles['cell'], cellData?.className)}
											key={`${column.accessor}${column.text}`}
										>
											{isDotVisible && columnIndex === 0 && (
												<div className={styles.cell_dot}>
													<Dot />
												</div>
											)}
											<div
												className={clsx(
													styles['cell-data'],
													columnIndex === 0 && isDraggable
														? styles['cell_draggable']
														: '',
												)}
												style={sectionIndent}
											>
												{columnIndex === 0 && isDraggable ? (
													<div {...provided.dragHandleProps}>
														<DragDropIcon className={styles.icon} />
													</div>
												) : null}
												{renderFn}
											</div>
										</td>
									);
								return <></>;
							})}
						</tr>
						{row.isCollapsed && !!row.child && (
							<tr style={style}>
								<td />
								<td colSpan={headers.length - 1}>{row.child()}</td>
							</tr>
						)}
					</>
				);
			}}
		</Draggable>
	) : (
		<>
			<tr
				id={row.id}
				className={clsx(
					styles.row,
					row.rowClassName && row.rowClassName,
					activeIndex === rowIndex && styles.active_row,
				)}
				ref={containerRef}
				onClick={row.onRowClick}
				onMouseEnter={row.onMouseEnter}
				onContextMenu={row.onContextMenu}
			>
				{headers.map((column, columnIndex) => {
					const cellData = row.dataLine.find(
						(item) => column.accessor === item.accessor,
					);
					const sectionIndent =
						columnIndex === 0
							? {
									marginLeft: DEFAULT_LEVEL_MARGIN * depthLevel,
							  }
							: undefined;

					const renderFn =
						cellData && cellData.renderCell ? (
							cellData.renderCell()
						) : column.renderCell && cellData ? (
							column.renderCell({ data: cellData, index: columnIndex })
						) : (
							<p className={styles['text']}>{cellData?.text}</p>
						);
					if (column.isVisible == null || column.isVisible)
						return (
							<td
								className={clsx(styles['cell'], cellData?.className)}
								key={`${column.accessor}${column.text}`}
							>
								{isDotVisible && columnIndex === 0 && (
									<div className={styles.cell_dot}>
										<Dot />
									</div>
								)}
								<div
									className={clsx(
										styles['cell-data'],
										columnIndex === 0 && isDraggable
											? styles['cell_draggable']
											: '',
									)}
									style={sectionIndent}
								>
									{renderFn}
								</div>
							</td>
						);
					return <></>;
				})}
			</tr>
			{row.isCollapsed && !!row.child && (
				<tr>
					<td />
					<td colSpan={headers.length - 1}>{row.child()}</td>
				</tr>
			)}
		</>
	);
}

export default TableRow;
