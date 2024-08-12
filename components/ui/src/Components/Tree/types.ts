import { ReactNode } from 'react';

export interface TreeProps {
	name: string;
	items: Tree[];
	className?: string;
	onExpand(id?: string): void;
}

export interface Tree {
	id: string;
	parentId: string | null;
	name: string;
	isExpanded: boolean;
	children: Tree[];
	renderFn?(): ReactNode;
}

export interface TreeItemProps {
	tree: Tree;
	onExpand(id: string): void;
	isLast?: boolean;
}
