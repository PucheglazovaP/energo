import { ReactNode } from 'react';

import { TreeItemType, TreeType } from '../../Types';

export interface ListHeaderProps {
	uncover: boolean;
	range?: boolean;
	count: boolean;
	unused?: boolean;
	treeType: TreeType;
}
export interface ListContainerProps {
	children?: ReactNode;
}
export interface ListProps {
	channels?: boolean;
	unusedChannel?: TreeItemType[];
	treeType: TreeType;
}

export enum FiltersTitle {
	GROUPS = 'Группы',
	DEVICES = 'Приборы',
	UNUSED_CHANNELS = 'Неподключенные каналы',
}
