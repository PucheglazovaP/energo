import { ReactNode } from 'react';

export type VerticalResizerProps = {
	children: Partial<[ReactNode, ReactNode]>;
	firstElementMinWidth: number;
	secondElementMinWidth: number;
	leftElementWidth?: number;
};
