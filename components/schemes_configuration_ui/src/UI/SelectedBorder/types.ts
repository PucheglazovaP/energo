import React from 'react';

export enum ActionType {
	None = 'none',
	TopLeftResize = 'topLeftResize',
	BottomLeftResize = 'bottomLeftResize',
	TopRightResize = 'topRightResize',
	BottomRightResize = 'bottomRightResize',
}
export type SelectedBorderProps = {
	x: number;
	y: number;
	width: number;
	height: number;
	onDrag: (deltaX: number, deltaY: number) => void;
	onDragStart?: () => void;
	onDragEnd?: (x: number, y: number) => void;
	onResize: (newX: number, newY: number, width: number, height: number) => void;
	onResizeStart?: () => void;
	onResizeEnd?: (x: number, y: number, width: number, height: number) => void;
	minHeight?: number;
	minWidth?: number;
	children?: React.ReactNode;
	isSelected: boolean;
	checkboxSize?: number;
	isActionsDisabled?: boolean;
	className?: string;
};
