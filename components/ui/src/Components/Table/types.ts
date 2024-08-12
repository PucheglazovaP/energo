import { ReactElement, ReactNode } from 'react';

export interface TableProps {
	header: Cell[];
	rows: Row[];
	className?: string;
	isLoading?: boolean;
	onScroll?: () => void;
	nodeBeforeHeader?: ReactNode;
}

export interface TableHeader {
	cells: Cell[]; // ячейки заголовка
}

export interface Row {
	id: string | number; // id строки
	cells: Cell[]; // массив ячеек строки таблицы
	className?: string;
	child?: TableProps; // Дочерняя таблица
	isCollapsed?: boolean;
}

export interface Cell {
	name: string;
	value?: string | number;
	className?: string;
	renderFn?: () => ReactElement;
}

export interface TableHeaderProps {
	header: Cell[];
	nodeBeforeHeader?: ReactNode;
}

export interface TableRowProps {
	row: Row;
}

export interface TableCellProps {
	cell: Cell;
	rowId: string | number;
}
