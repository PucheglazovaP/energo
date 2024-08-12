import { ReactNode } from 'react';

export enum ArrowDirection {
	RIGHT = 'right',
	LEFT = 'left',
	UP = 'up',
	DOWN = 'down',
}

export interface ArrowProps {
	className?: string;
	direction?: ArrowDirection;
}

export interface IconButtonProps {
	children?: ReactNode;
	onClick?: () => void;
	className?: string;
}

export interface CloseProps {
	className?: string;
	height?: string;
	width?: string;
	color?: string;
}
