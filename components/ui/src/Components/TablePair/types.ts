import { ReactNode } from 'react';

export type TableValue = string | number | null;

export type TableValueFormatter = (
	value: TableValue,
	columnValues?: TableValue[],
	rowIndex?: number,
) => string;

export type TableCell = {
	name: string;
	value: TableValue;
	formatCell?: TableValueFormatter;
	renderCell?: (
		value: TableValue,
		formatValue: TableValueFormatter,
		columnValues?: TableValue[],
		rowIndex?: number,
	) => ReactNode;
};

export interface TablePairProps {
	className?: string;
	style?: Record<string, string>;
	data: TableCell[][][];
	firstRowAsHeader?: boolean;
	captions?: (string | undefined)[];
	areRowSelected?: (rowData: TableCell[]) => boolean;
}

export interface TableRowGroupProps {
	className?: string;
	style?: Record<string, string>;
	data: TableCell[][];
	firstRowAsHeader?: boolean;
	caption?: string;
	areRowSelected?: (rowData: TableCell[]) => boolean;
	allRows?: TableCell[][];
}

export interface TableRowProps {
	className?: string;
	style?: Record<string, string>;
	data: TableCell[];
	isHeader?: boolean;
	isSelected?: boolean;
	allRows?: TableCell[][];
}
