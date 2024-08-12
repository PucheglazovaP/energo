import React from 'react';

export interface ContextMenuProps {
	items: ContextMenuItem[];
	position: ContextMenuPosition | null;
	setPosition: (pos: ContextMenuPosition | null) => void;
	className?: string;
	onCloseContextMenu?: () => void;
}

export interface SeparatorProps {
	name?: string;
}

export interface ButtonProps {
	item: ContextMenuItem;
	onClick?: (item: ContextMenuItem) => void;
	className: string;
}

export interface IntermediateProps {
	item: ContextMenuItem;
}

export interface ContextMenuItem {
	name: string;
	onClick?: () => void;
	isDisabled?: boolean;
	renderFn?: () => React.ReactNode;
	withSeparator?: boolean;
	separatorName?: string;
	children?: ContextMenuItem[];
	className?: string;
	isNotCloseOnClick?: boolean;
	isNotButton?: boolean;
	key?: string;
	isVisible?: boolean;
}

export interface ContextMenuPosition {
	x: number | string;
	y: number | string;
}

export type NullableMenuPosition = ContextMenuPosition | null;
