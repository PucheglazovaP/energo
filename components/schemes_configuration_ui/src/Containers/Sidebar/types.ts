import { TreeTypes } from '../../Shared/types';

export type SidebarProps = {
	type: TreeTypes;
	versionId?: number;
	className?: string;
};

export type SidebarTreeProps = SidebarProps;
