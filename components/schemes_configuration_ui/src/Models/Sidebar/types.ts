import { TreeTypes } from '../../Shared/types';

export type SidebarType = {
	type: TreeTypes;
	isChecked: boolean;
	value: string;
};

export type Sidebar = {
	isOpen: boolean;
	isDisabled: boolean;
	contextMenuId: number;
	treeTypes: SidebarType[];
};
