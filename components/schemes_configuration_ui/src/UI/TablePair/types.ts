import React, { ReactNode } from 'react';

export type TableValue = string | number | null;

export type TableValueFormatter = (
	value: TableValue,
	columnValues?: TableValue[],
	rowIndex?: number,
) => string;

export type RenderCellParams = {
	value?: TableValue;
	formatValue?: TableValueFormatter;
	columnValues?: TableValue[];
	rowIndex?: number;
	isHover?: boolean;
};

export type RenderCellFunction = (params: RenderCellParams) => ReactNode;

export type TableCell = {
	name: string;
	value: TableValue;
	formatCell?: TableValueFormatter;
	renderCell?: RenderCellFunction;
	width?: number; // Interpret as px
};

export interface TablePairProps {
	className?: string;
	style?: React.CSSProperties;
	data: TableCell[][][];
	firstRowAsHeader?: boolean;
	captions?: (string | undefined)[];
	areRowSelected?: (rowData: TableCell[]) => boolean;
	isDraggable?: boolean;
	draggableId?: string;
}

export interface TableRowGroupProps {
	className?: string;
	style?: React.CSSProperties;
	data: TableCell[][];
	firstRowAsHeader?: boolean;
	caption?: string;
	areRowSelected?: (rowData: TableCell[]) => boolean;
	allRows?: TableCell[][];
	isDraggable?: boolean;
}

export interface TableRowProps {
	className?: string;
	style?: React.CSSProperties;
	data: TableCell[];
	isHeader?: boolean;
	isSelected?: boolean;
	allRows?: TableCell[][];
	rowIndex: number;
	isDraggable?: boolean;
}

export interface TablePairNotDroppableWrapperProps {
	children?: ReactNode;
	className?: string;
	customStyle?: React.CSSProperties;
}

export interface TablePairDroppableWrapperProps
	extends TablePairNotDroppableWrapperProps {
	id: string;
}
