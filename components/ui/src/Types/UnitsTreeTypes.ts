export type UnitsTreeItem = {
	id: number;
	name: string;
	displayName: string;
	parentId?: number;
	isOpen: boolean;
	isLast: boolean;
};

export type UnitItemClickFunction = (id: number, title: string) => void;
export type SearchUnitsItemsFunction = (
	treeItems: UnitsTreeItem[],
) => UnitsTreeItem[];
export interface UnitsTreeProps {
	className?: string;
	style?: Record<string, string>;
	parentId?: number;
	onItemClick?: UnitItemClickFunction;
	searchItems?: SearchUnitsItemsFunction;
}

export interface UnitsTreeItemProps {
	name: string;
	displayName: string;
	treeItemId: number;
	isTreeItemOpen: boolean;
	onItemClick?: UnitItemClickFunction;
	isLast: boolean;
}
