import React from 'react';

import { SelectGroupMode } from '../../Shared/types';
export interface ModalIconSearchProps {
	className?: string;
	style?: React.CSSProperties;
	filterTreeClick?: any;
	sortingList?: any;
	order?: number;
}
export interface SortingOptionsProps {
	optionsMode: number;
	optionsFilter: string;
}

export enum GroupProperty {
	csqlGroupName = 'groupName',
	asqlGroupName = 'asqlGroupName',
}

export enum GroupIdProperty {
	groupId = 'groupId',
	asqlGroupId = 'asqlGroupId',
}
export interface HardwareGroupProps {
	mode: SelectGroupMode;
}
