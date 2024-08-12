import React from 'react';
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
	csqlGroupName = 'csqlGroupName',
	asqlGroupName = 'asqlGroupName',
}

export enum GroupIdProperty {
	groupId = 'groupId',
	asqlGroupId = 'asqlGroupId',
}
