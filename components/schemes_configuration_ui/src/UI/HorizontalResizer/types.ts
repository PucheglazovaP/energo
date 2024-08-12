import { ReactNode } from 'react';

export type HorizontalResizerProps = {
	children: Partial<[ReactNode, ReactNode]>;
	firstElementMinHeight: number;
	secondElementMinHeight: number;
	className?: string;
};
