import { TableCell, TableValue } from './types';

export function* getColumnCells(
	data: TableCell[][],
	columnIndex: number,
): Generator<TableValue> {
	for (const row of data) {
		yield row[columnIndex].value;
	}
}
