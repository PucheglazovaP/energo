import { ReactNode } from 'react';
export type DeviceHealthinessSectionProps = {
	id: number;
	path: string;
};

export type DeviceHealthinessHeaderProps = {
	children: ReactNode;
};

export type DeviceHealthinessHighlightCellProps = {
	backgroundColor: string;
	text: string;
};
