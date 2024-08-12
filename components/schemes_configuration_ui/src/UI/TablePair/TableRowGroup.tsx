import clsx from 'clsx';

import TableRow from './TableRow';
import { TableRowGroupProps } from './types';

import styles from './TablePair.module.css';

function TableRowGroup({
	className,
	style,
	data,
	caption,
	firstRowAsHeader,
	areRowSelected = () => false,
	allRows = [],
	isDraggable,
}: TableRowGroupProps) {
	return (
		<>
			{caption && (
				<div className={styles.caption_wrapper}>
					<h5 className={styles.caption}>{caption}</h5>
				</div>
			)}
			{data.map((rowData, rowIndex) => (
				<TableRow
					key={rowIndex}
					data={rowData}
					className={clsx(
						className,
						rowIndex === data.length - 1 && styles.last_row,
					)}
					style={style}
					isHeader={rowIndex === 0 && firstRowAsHeader}
					isSelected={areRowSelected(rowData)}
					allRows={allRows}
					rowIndex={rowIndex}
					isDraggable={isDraggable}
				/>
			))}
		</>
	);
}

export default TableRowGroup;
