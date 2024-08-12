import React from 'react';

import { TableCell } from '../TablePair/types';
export interface TableInfinityProps {
	className?: string;
	style?: React.CSSProperties;
	data: TableCell[][][];
	firstRowAsHeader?: boolean;
	captions?: (string | undefined)[];
	areRowSelected?: (rowData: TableCell[]) => boolean;
	loadNext?: () => void;
	loadPrev?: () => void;
	onChangeScrollPosition?: (scrollPosition: number) => void;
	scrollPosition?: number | null;
}
