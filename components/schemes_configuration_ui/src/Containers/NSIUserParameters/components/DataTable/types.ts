import { CSSProperties, MouseEvent, ReactNode } from 'react';

export type DataTableCell = {
	cellId: string;
	cellClassName: string;
	title?: string;
	content: string | number | ReactNode;
};

export type TableDataItem = {
	columnId: string;
	columnClassName?: string;
	columnStyle?: CSSProperties;
	cells: DataTableCell[];
	equipmentNumber?: string;
};

export interface DataTableProps {
	className?: string;
	stickyCellsCount?: number;
	headerData?: DataTableCell[];
	headerClassName?: string;
	bodyData: TableDataItem[];
	selectedInstrumentNumber?: string;
	bodyClassName?: string;
	orientation?: 'row' | 'column';
	onScroll?: () => void;
	onContextMenu?: (evt: MouseEvent, equipmentNumber: string) => void;
}
