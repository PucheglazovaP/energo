import React, { FC, ReactElement, ReactNode } from 'react';
import { DropResult } from 'react-beautiful-dnd';

export type Cell = {
	accessor: string;
	text: string | number;
	className?: string;
	[propName: string]: any;
	renderCell?: () => JSX.Element;
};

export type RenderCell = {
	data: Cell;
	index: number;
};

export interface ITableColumn {
	accessor: string;
	text: string;
	sortOrder: number;
	isResizable?: boolean;
	isSortable?: boolean;
	type?: string;
	minWidth?: number;
	width?: number;
	maxWidth?: number;
	renderHeaderCell?: (() => JSX.Element) | (() => ReactNode);
	renderCell?: FC<RenderCell>;
	ref?: React.RefObject<HTMLTableCellElement>;
	isVisible?: boolean;
	className?: string;
}

export interface ITableBody {
	rowClassName?: string;
	dataLine: Cell[];
	isCollapsed?: boolean;
	child?: () => ReactNode;
	sectionAccessor?: string;
	onRowClick?: () => void;
	onMouseEnter?: () => void;
	onContextMenu?: (evt: React.MouseEvent) => void;
	[propName: string]: any;
}
export interface ITableHeader {
	headers: ITableColumn[];
	handleSorting?: (accessor: string) => void;
	headerSupComponent?: () => JSX.Element;
	headerBottomComponent?: () => JSX.Element;
}
export interface TableSection {
	sectionAccessor: string;
	text: string;
	isExpanded?: boolean;
	parentAccessor?: string;
	renderSection?: ReactNode;
	className?: string;
	onContextMenu?: (evt: React.MouseEvent) => void;
}

export type TableBodyProps = {
	headers: ITableColumn[];
	data: ITableBody[];
	depthLevel?: number;
	isDotVisible?: boolean;
	isDraggable?: boolean;
	activeIndex?: number | null;
};

export type TableBodySectionsProps = {
	headers: ITableColumn[];
	sections: TableSection[];
	data: ITableBody[];
	handleExpandCollapse?: (accessor: string) => void;
};

export type TableRowProps = {
	headers: ITableColumn[];
	row: ITableBody;
	depthLevel?: number;
	isDotVisible?: boolean;
	isDraggable?: boolean;
	rowIndex: number;
	activeIndex?: number | null;
};

export type TableSectionProps = {
	accessor: string;
	title: string;
	children: ReactElement[];
	isExpanded?: boolean;
	level?: number;
	colSpan?: number;
	renderSection?: ReactNode;
	handleExpandCollapse?: (accessor: string) => void;
	className?: string;
	onContextMenu?: (evt: React.MouseEvent) => void;
};

export type TableDndWrapperProps = {
	droppableId?: string;
	children: ReactNode;
	onDragEnd?: (result: DropResult) => void;
	isDraggable?: boolean;
};

export type RowDndWrapperProps = {
	isDraggable: boolean;
	rowIndex: number;
	children: ReactNode;
	className?: string;
	isCollapsed?: boolean;
	additionalContent?: ReactNode;
	colSpan?: number;
};

export type TableHighlightCellProps = Cell & { backgroundColor?: string };

export default {};
