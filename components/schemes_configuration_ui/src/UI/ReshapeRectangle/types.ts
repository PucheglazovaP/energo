import React from 'react';
export type TReshapeRectangle = {
	width: number;
	height: number;
	startX: number;
	startY: number;
};
export type ReshapeRectangleProps = TReshapeRectangle & {
	className?: string;
	handleResizeEnd: (
		x: number,
		y: number,
		width: number,
		height: number,
	) => void;
	handleDragEnd: (x: number, y: number) => void;
	onContextMenu?: (evt: React.MouseEvent) => void;
};
