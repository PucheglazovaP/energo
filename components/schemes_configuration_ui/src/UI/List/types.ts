import React, { ButtonHTMLAttributes, ReactNode } from 'react';

export type TListItem = ButtonHTMLAttributes<HTMLButtonElement> & {
	id: string;
	title?: string;
	renderFn?: (item: TListItem) => ReactNode;
	onClick?: (evt: React.MouseEvent<HTMLButtonElement>) => void;
};
export type ListProps = {
	items: TListItem[];
	className?: string;
	selectedItemId?: string;
};
export type ListItemProps = {
	item: TListItem;
	selectedId?: string;
};
