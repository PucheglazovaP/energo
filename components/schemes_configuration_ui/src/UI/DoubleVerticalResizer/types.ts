import { ReactNode } from 'react';

export type DoubleVerticalResizerSizes = {
	leftElementMinWidth: number;
	rightElementMinWidth: number;
	leftElementMaxWidth?: number;
	rightElementMaxWidth?: number;
	leftElementDefaultWidth?: number;
	rightElementDefaultWidth?: number;
};
export interface DoubleVerticalResizerProps extends DoubleVerticalResizerSizes {
	children: Partial<[ReactNode, ReactNode, ReactNode]>;
}
