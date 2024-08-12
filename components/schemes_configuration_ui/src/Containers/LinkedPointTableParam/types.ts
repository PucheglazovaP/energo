import React from 'react';

import { ITableBody, ITableColumn } from '../../UI/Table/types';

export interface LinkedPointTableParamProps {
	data: ITableBody[];
	header: ITableColumn[];
	handleEditLinkedPoint: React.MouseEventHandler<HTMLButtonElement>;
	handleUnbindPoint?: React.MouseEventHandler<HTMLButtonElement>;
	isUpdateMode?: boolean;
	isUnbindMode?: boolean;
}
