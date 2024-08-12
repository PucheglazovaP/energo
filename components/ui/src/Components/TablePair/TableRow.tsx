import clsx from 'clsx';

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
}: TableRowProps) {
	return (
		<>
			{data.map((cell, columnIndex) => {
				const formatValue =
					cell.formatCell ||
					((value: TableValue) => (value != null ? String(value) : ' '));
				const renderCell =
					cell.renderCell ||
					((value: TableValue, formatValue: TableValueFormatter) =>
						formatValue(value));
				return (
					<div
						className={clsx(
							styles.cell,
							className,
							isHeader && styles.header,
							columnIndex === 0 && styles.first_cell,
							columnIndex === data.length - 1 && styles.last_cell,
							isSelected && styles.selected,
						)}
						style={style}
						key={cell.name}
					>
						<div className={styles.value}>
							{renderCell(cell.value, formatValue, [
								...getColumnCells(allRows, columnIndex),
							])}
						</div>
					</div>
				);
			})}
		</>
	);
}

export default TableRow;
