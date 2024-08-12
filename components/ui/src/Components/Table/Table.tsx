import { ForwardedRef, forwardRef, Fragment, useCallback, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import clsx from 'clsx';

import Spinner from '../Spinner';

import {
	Cell,
	Row,
	TableCellProps,
	TableHeaderProps,
	TableProps,
	TableRowProps,
} from './types';
import styles from './Table.module.scss';

function TableHeader(props: TableHeaderProps) {
	const { header, nodeBeforeHeader } = props;
	return (
		<thead className={styles.header}>
			{nodeBeforeHeader}
			<tr className={styles.header__row}>
				{header.map((cell) => (
					<th key={cell.name} className={styles.header__cell}>
						{cell.renderFn ? cell.renderFn() : cell.value}
					</th>
				))}
			</tr>
		</thead>
	);
}

function TableCell(props: TableCellProps) {
	const { cell, rowId } = props;
	return (
		<td data-row-id={rowId} className={clsx(styles.cell, cell.className)}>
			{cell.renderFn ? cell.renderFn() : cell.value}
		</td>
	);
}

function TableRow(props: TableRowProps) {
	const { row } = props;

	return (
		<tr className={clsx(styles.row, row.className)}>
			{row.cells.map((cell) => (
				<TableCell key={`${cell.name}-${row.id}`} cell={cell} rowId={row.id} />
			))}
		</tr>
	);
}

const Table = forwardRef(
	(props: TableProps, ref: ForwardedRef<HTMLTableElement>) => {
		const { header, rows, className, isLoading, onScroll, nodeBeforeHeader } =
			props;
		const nodeRef = useRef(null);

		// Сортировка ячеек таблицы в порядке, подходящем заголовку
		const sortCellsByHeader = useCallback(
			(cells: Cell[]) => {
				const sortedCells: Cell[] = new Array(header.length);
				for (const cell of cells) {
					const idx = header.findIndex((header) => header.name === cell.name);
					sortedCells[idx] = cell;
				}
				return sortedCells;
			},
			[header],
		);

		const sortedRows: Row[] = rows.map((row) => ({
			...row,
			id: row.id,
			cells: sortCellsByHeader(row.cells),
		}));

		const collapsedRowShown = useCallback(
			(row: Row) => !!row.child && row.isCollapsed,
			[],
		);

		return (
			<div
				className={clsx(styles.table__wrapper, className)}
				ref={ref}
				onScroll={onScroll}
			>
				<table className={styles.table}>
					{!!header && (
						<TableHeader header={header} nodeBeforeHeader={nodeBeforeHeader} />
					)}
					<tbody className={styles.table__body}>
						{sortedRows.map((row) => (
							<Fragment key={row.id}>
								<TableRow row={row} />
								<CSSTransition
									nodeRef={nodeRef}
									in={collapsedRowShown(row)}
									timeout={150}
									appear
									unmountOnExit
									classNames={{
										appear: styles.inner,
										enter: styles.inner,
										enterActive: styles.inner__enterActive,
										appearActive: styles.inner__enterActive,
										exitActive: styles.inner__exitActive,
										exit: styles.inner__exit,
									}}
								>
									<tr>
										<td />
										<td colSpan={header.length - 1} ref={nodeRef}>
											<Table {...row.child!} />
										</td>
									</tr>
								</CSSTransition>
							</Fragment>
						))}
						{isLoading && (
							<tr>
								<td colSpan={header.length}>
									<Spinner className={styles.spinner} />
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		);
	},
);

Table.displayName = 'Table';

export default Table;
