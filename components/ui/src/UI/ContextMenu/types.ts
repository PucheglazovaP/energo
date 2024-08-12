import React from 'react';
export interface ContextMenuProps {
	items: ContextMenuItem[];
	position: ContextMenuPosition | null;
	setPosition: (pos: ContextMenuPosition | null) => void;
	className?: string;
}

export interface ContextMenuItem {
	name: string;
	onClick?: () => void;
	isDisabled?: boolean;
	body?: React.ReactNode;
}

export interface ContextMenuPosition {
	x: number;
	y: number;
}
