import { CSSProperties } from 'react';

import { CalendarType } from '../../Shared/types';

export type Accessors = 'interface' | 'accounting' | 'status' | '';

export interface ReportTableProps {
	isEditMode: boolean;
	onCloseParameters: () => void;
}

export interface ReportTableRadioButtonCellProps {
	title: string;
	selected: boolean;
	className?: string;
	style?: CSSProperties;
}

export type CalendarUsedTypes = CalendarType.Day | CalendarType.Period;
