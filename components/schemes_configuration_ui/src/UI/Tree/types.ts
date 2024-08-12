/* global React */
import { ReactNode } from 'react';

export type TreeItem = {
	id: number;
	name: string;
	displayName: string;
	defaultId?: number;
	itemNumber?: string | null;
	order?: number;
	parentId?: number;
	parentType?: string;
	method?: string;
	type?: string;
	isLast?: boolean;
	isOpen?: boolean;
	renderFn?: () => ReactNode;
};

export type ItemClickFunction = (node: TreeItem) => void;

export type ContextMenuFunction = (
	evt: React.MouseEvent<HTMLButtonElement>,
	id: number,
	node: TreeItem,
) => void;

export type ActiveNode = { id: number | undefined; type: string | undefined };

export interface TreeProps {
	className?: string;
	style?: React.CSSProperties;
	parentId?: number;
	parentType?: string;
	onItemClick?: ItemClickFunction;
	onExpand?: ItemClickFunction;
	onContextMenu?: ContextMenuFunction;
	treeData: TreeItem[];
	activeId?: number | null;
	isExpandable?: boolean;
	needSort?: boolean;
	withExpand?: boolean; // expand when item clicked
	lastPositionNode?: TreeItem;
	activeNode?: ActiveNode;
	isDefaultExpanded?: boolean;
}

export interface TreeItemProps {
	node: TreeItem;
	onItemClick?: ItemClickFunction;
	onExpand?: ItemClickFunction;
	onContextMenu?: ContextMenuFunction;
	treeData: TreeItem[];
	activeId?: number | null;
	isExpandable: boolean;
	needSort: boolean;
	withExpand: boolean;
	lastPositionNode?: TreeItem;
	activeNode?: ActiveNode;
	isDefaultExpanded?: boolean;
}
